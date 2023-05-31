import {DateTime} from 'luxon';
import _reduce from 'lodash-es/reduce';
import _get from 'lodash-es/get';
import _assign from 'lodash-es/assign';
import _isString from 'lodash-es/isString';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isNil from 'lodash-es/isNil';

import {
    IFreeRound,
    ILoyalty,
    IUserInfo,
    ISocketsData,
    TUserValidationLevel,
    IBonusesBalance,
    IIndexing,
} from 'wlc-engine/modules/core/system/interfaces';
import {TranslateService} from '@ngx-translate/core';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {
    EventService,
    IFromLog,
} from 'wlc-engine/modules/core/system/services';

export class UserInfo extends AbstractModel<IUserInfo> {

    public separateLoyalty: boolean = false;
    protected $loyaltyData: ILoyalty = {} as ILoyalty;

    constructor(
        from: IFromLog,
        protected translateService: TranslateService,
        protected eventService: EventService,
    ) {
        super({from: _assign({model: 'UserInfo'}, from)});
    }

    public get lockExpiresAt(): string {
        return this.data?.LockExpiresAt;
    }

    public get affiliateID(): string {
        return this.data?.affiliateID;
    }

    public get availableWithdraw(): number {
        return this.data?.availableWithdraw;
    }

    public get balance(): number {
        return this.data?.balance;
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

    public get socketsData(): ISocketsData {
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
        return _isNil(this.bonusesBalance)
            ? 0
            : _reduce((this.bonusesBalance),
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
        return this.balance - this.bonusBalance;
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
    public get nextTermsVersion(): string | DateTime {
        const date = DateTime.fromSQL(this.data?.toSWlcVersion, {zone: 'utc'});
        if (date.invalidReason) {
            return this.data?.toSWlcVersion || '';
        } else {
            return date;
        }
    }

    /** Get date of current accepted terms & conditions */
    public get currentTermsVersion(): string | DateTime {
        if (this.data?.toSVersion?.ToSVersion) {
            const date = DateTime.fromSQL(this.data.toSVersion.ToSVersion, {zone: 'utc'});
            if (date.invalidReason) {
                return this.data.toSVersion.ToSVersion;
            } else {
                return date;
            }
        }
        return '';
    }

    /** Get true when last terms & conditions accepted */
    public get isTermsActual(): boolean {
        if (this.nextTermsVersion instanceof DateTime) {
            if (this.nextTermsVersion > DateTime.now()) {
                return true;
            } else if (this.currentTermsVersion instanceof DateTime) {
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
        return this.data?.Tags || {};
    }

    protected override checkData(): void {
        //TODO AFTER RELEASE 13.11.2020
        /*if (!this.data?.status) {
            this.eventService.emit({
                name: 'USER_STATUS_DISABLE',
            });
        }*/
    }
}
