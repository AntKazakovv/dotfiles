import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _reduce from 'lodash-es/reduce';
import _get from 'lodash-es/get';
import _assign from 'lodash-es/assign';
import _isString from 'lodash-es/isString';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isNil from 'lodash-es/isNil';
import _isNumber from 'lodash-es/isNumber';
import _toNumber from 'lodash-es/toNumber';
import _isUndefined from 'lodash-es/isUndefined';
import {TranslateService} from '@ngx-translate/core';

import {
    IFreeRound,
    ILoyalty,
    IUserInfo,
    TUserValidationLevel,
    IBonusesBalance,
    IIndexing,
} from 'wlc-engine/modules/core/system/interfaces';
import {IWebSocketConfig} from 'wlc-engine/modules/core/system/interfaces/websocket.interface';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {
    ConfigService,
    IFromLog,
} from 'wlc-engine/modules/core/system/services';

import {
    ISelectedWallet,
    IWallet,
    IWSWallet,
} from 'wlc-engine/modules/multi-wallet/system/interfaces/wallet.interface';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';
import {IWSDataUserBalance} from 'wlc-engine/modules/user/system/interfaces/user.interface';

export class UserInfo extends AbstractModel<IUserInfo> {

    public separateLoyalty: boolean = false;
    public static currency: string = '';
    public bonusBalanceWS: number = null;

    protected $loyaltyData: ILoyalty = {} as ILoyalty;

    private _wsWallets: IIndexing<IWallet>;
    private _wcAvailableWithdraw: number;

    constructor(
        from: IFromLog,
        protected translateService: TranslateService,
    ) {
        super({from: _assign({model: 'UserInfo'}, from)});
    }

    public get lockExpiresAt(): string {
        return this.data?.LockExpiresAt;
    }

    public get notifyKycQuestionnaire(): boolean {
        return this.data?.NotifyKYCQuestionnaire;
    }

    public get affiliateID(): string {
        return this.data?.affiliateID;
    }

    public set availableWithdraw(availableWithdraw: number) {
        this._wcAvailableWithdraw = availableWithdraw;
    }

    public get availableWithdraw(): number {

        if (this.data.socketsData && _isUndefined(this._wcAvailableWithdraw)) {
            return null;

        } else if (!!UserInfo.currency) {
            return this.getWalletAvailableWithdraw(UserInfo.currency);

        } else {
            return this._wcAvailableWithdraw ?? this.data?.availableWithdraw;
        }
    }

    public set balance(balance: number) {
        this.data.balance = balance;
    }

    public get balance(): number {
        return (UserInfo.currency ? this.getWalletBalance(UserInfo.currency) :
            this.data?.balance) * WalletHelper.coefficientConversion;
    }

    public getAvailableWithdrawForSelectWallet(selectedWallet: ISelectedWallet): number {
        if (selectedWallet) {
            return this.getWalletAvailableWithdraw(selectedWallet.walletCurrency);
        } else return this.availableWithdraw;
    }

    public getBalanceForSelectWallet(selectedWallet: ISelectedWallet): number {
        if (selectedWallet) {
            return this.getWalletBalance(selectedWallet.walletCurrency);
        } else return this.balance;
    }

    public get blockByLocation(): boolean {
        return this.data.blockByLocation ?? false;
    }

    public get category(): string {
        return this.data?.category;
    }

    public get email(): string {
        return this.data?.email;
    }

    public get emailHash(): string {
        return this.data?.emailHash;
    }

    public get firstName(): string {
        return this.data?.firstName;
    }

    public get firstSession(): boolean {
        return this.data?.firstSession;
    }

    public get freeRounds(): IFreeRound[] {
        return this.data?.freerounds;
    }

    public get freespins(): number {
        return _reduce(this.freeRounds, (accumulator: number, freeround: IFreeRound) => {
            return accumulator + Number(_get(freeround, 'Count', 0));
        }, 0);
    }

    public get idUser(): string {
        return this.data?.idUser;
    }

    public get lastName(): string {
        return this.data?.lastName;
    }

    public get loyalty(): ILoyalty {
        return this.$loyaltyData;
    }

    public set loyalty(data: ILoyalty) {
        this.$loyaltyData = _assign({}, this.$loyaltyData, data);
        // TODO remove after bugfix in socket server
        if (_isString(this.$loyaltyData?.LevelName)) {
            try {
                _assign(this.$loyaltyData, {LevelName: JSON.parse(this.$loyaltyData?.LevelName)});
            } catch (error) {
                //
            }
        }
        this.data.loyalty = this.$loyaltyData;
        this.checkData();
    }

    public get pinCode(): string {
        return this.data?.pincode;
    }

    public get socketsData(): IWebSocketConfig {
        return _isString(this.data?.socketsData) ? null : this.data?.socketsData;
    }

    public get status(): number {
        return this.data?.status;
    }

    /**
     * Will return a significant amount of the bonus balance
     * @returns {number}
     */
    public get bonusBalance(): number {
        return this.originalBonusBalance * WalletHelper.coefficientOriginalCurrencyConversion;
    }

    public get originalBonusBalance(): number {
        if (_isNumber(this.bonusBalanceWS)) {
            return this.bonusBalanceWS;
        }

        if (_isNil(this.bonusesBalance)) {
            return 0;
        }

        return _reduce((this.bonusesBalance),
            (accumulator: number, bonusBalance: IBonusesBalance): number => {
                return accumulator + Number(_get(bonusBalance, 'Balance', 0));
            }, 0);
    }

    /**
     * Will return data about the balance of each bonus
     * @returns {IIndexing<IBonusesBalance>}
     */
    public get bonusesBalance(): IIndexing<IBonusesBalance> {
        return this.data?.loyalty?.BonusesBalance;
    }

    public get realBalance(): number {
        return UserInfo.currency
            ? this.getWalletBalance(UserInfo.currency) * WalletHelper.coefficientConversion
            : this.balance - this.bonusBalance;
    }

    public get originalRealBalance(): number {
        return UserInfo.currency
            ? this.getWalletBalance(UserInfo.currency)
            : this.data?.balance - this.originalBonusBalance;
    }

    public get level(): number {
        return +this.data?.loyalty?.Level || 0;
    }

    public get depositsCount(): number {
        return +this.data?.loyalty?.DepositsCount || 0;
    }

    public get levelName(): string {
        const defaultLanguage = 'en'; //TODO default lang
        const currentLanguage = this.translateService.currentLang;

        return this.data?.loyalty?.LevelName[currentLanguage] || this.data?.loyalty?.LevelName[defaultLanguage];
    }

    public get points(): number {
        return +this.data?.loyalty?.Points || 0;
    }

    public get nextLevelPoints(): number {
        return +this.data?.loyalty?.NextLevelPoints || 0;
    }

    /** Get date of next terms & conditions */
    public get nextTermsVersion(): string | Dayjs {
        const date = dayjs(this.data.toSWlcVersion);
        if (!date.isValid()) {
            return this.data?.toSWlcVersion || '';
        } else {
            return date;
        }
    }

    /** Get date of current accepted terms & conditions */
    public get currentTermsVersion(): string | Dayjs {
        if (this.data?.toSVersion?.ToSVersion) {
            return this.getTermsVersion(this.data.toSVersion.ToSVersion);
        }
        return '';
    }

    /** Get terms version */
    public getTermsVersion(version: string): string | Dayjs {
        let date = dayjs(version);
        if (!date.isValid()) {
            // доп проверка для версий термсов
            date = dayjs(version, 'DD-MM-YYYY');

            if (!date.isValid()) {
                return version;
            } else {
                return date;
            }
        } else {
            return date;
        }
    }

    /** Get true when last terms & conditions accepted */
    public get isTermsActual(): boolean {
        if (this.nextTermsVersion instanceof dayjs) {
            if (this.nextTermsVersion > dayjs()) {
                return true;
            } else if (this.currentTermsVersion instanceof dayjs) {
                return this.currentTermsVersion >= this.nextTermsVersion;
            }
        }
        return this.data?.toSWlcVersion // allow skip null and empty string
            ? this.data?.toSVersion?.ToSVersion === this.data?.toSWlcVersion
            : true;
    }

    /** update toSVersion */
    public set toSVersion(value: IUserInfo['toSVersion']) {
        this.data.toSVersion = value;
    }

    /**
     * It returns the validation level property of user.
     * @returns {TUserValidationLevel} The validationLevel property.
     */
    public get validationLevel(): TUserValidationLevel {
        return this.data.validationLevel;
    }

    public get enabled2FAGoogle(): boolean {
        return this.data?.enabled2FAGoogle;
    }

    public get notify2FAGoogle(): boolean {
        return this.data?.notify2FAGoogle;
    }

    public get ageConfirmed(): boolean {
        return this.data?.ageConfirmed;
    }

    public get agreeWithSelfExcluded(): boolean {
        return this.data?.agreeWithSelfExcluded;
    }

    public get agreedWithTermsAndConditions(): boolean {
        return this.data?.agreedWithTermsAndConditions;
    }

    public override set data(data: IUserInfo) {
        super.data = _cloneDeep(data);
        if (this.data && this.separateLoyalty) {
            if (this.$loyaltyData) {
                this.data.loyalty = this.$loyaltyData;
            } else {
                this.$loyaltyData = this.data.loyalty;
            }

            if (this.data.loyalty) {
                this.data.loyalty.BonusesBalance = data.loyalty.BonusesBalance;
            }
        } else {
            this.$loyaltyData = this.data?.loyalty;
        }
    }

    public override get data(): IUserInfo {
        return super.data;
    }

    public get tags(): IIndexing<string> {
        if (Array.isArray(this.data.Tags)) {
            return {};
        }

        return this.data?.Tags || {};
    }

    public setWalletBalance(wsBalanceData: IWSDataUserBalance, isMultiWallet: boolean, originalCurrency: string): void {

        if (wsBalanceData.IsWallet) {
            this._wsWallets[wsBalanceData.Currency].balance = wsBalanceData.Balance;

        } else if (isMultiWallet) {
            this._wsWallets[originalCurrency].balance = wsBalanceData.Balance;
        }
    }

    public set wsWallets(wallets: IIndexing<IWSWallet>) {

        if (!this._wsWallets) {
            this._wsWallets = this.data.wallets;
        }

        for (let id in wallets) {
            const wallet: IWSWallet = wallets[id];
            let wsWallet: IWallet = this._wsWallets[wallet.Currency];

            if (wsWallet) {
                wsWallet.balance = wallet.Balance;

                if (wallet.availableWithdraw) {
                    wsWallet.availableWithdraw = wallet.availableWithdraw;
                }

            } else {
                this._wsWallets[wallet.Currency] = {
                    currency: wallet.Currency,
                    balance: wallet.Balance,
                    walletId: _toNumber(id),
                    availableWithdraw: this.data.wallets[wallet.Currency]?.availableWithdraw ?? '0.00',
                };
            }
        }
    }

    public get wallets(): IIndexing<IWallet> {
        return this._wsWallets ?? this.data?.wallets;
    }

    public get transfersAllowed(): boolean {
        return this.data?.transfersAllowed;
    }

    public get allowAccessToAddStreamWheel(): boolean {
        return this.data?.allowAccessToAddStreamWheel;
    }

    public get streamWheelOwner(): number {
        return this.data?.streamWheelOwner;
    }

    public get streamWheelsParticipant(): number[] {
        return this.data?.streamWheelsParticipant;
    }

    protected override checkData(): void {
        //TODO AFTER RELEASE 13.11.2020
        /*if (!this.data?.status) {
            this.eventService.emit({
                name: 'USER_STATUS_DISABLE',
            });
        }*/
    }

    public checkTagExists(tag: string): boolean {
        return Object.values(this.tags).indexOf(tag) >= 0;
    }

    public getWalletBalance(currency: string): number {
        return this.wallets && this.wallets[currency]?.balance ? _toNumber(this.wallets[currency]?.balance) : 0;
    }

    private getWalletAvailableWithdraw(currency: string): number {
        return this.wallets && this.wallets[currency]?.availableWithdraw
            ? _toNumber(this.wallets[currency]?.availableWithdraw) : 0;
    }

    public getRequiredRegisterCheckbox(configService: ConfigService): string[] {
        const checkboxNames = configService.get<string[]>(
            {name: '$base.registration.requiredRegisterCheckboxNames'}) || [];
        return checkboxNames.reduce((acc: string[], key) => {

            if (!_isUndefined(this.data?.[key])) {

                return [...acc, key];
            }

            return acc;
        }, []);
    }

    public get displayConsolidatedBalanceToStreamer(): boolean {
        return this.data?.displayConsolidatedBalanceToStreamer;
    };
}
