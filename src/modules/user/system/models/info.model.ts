import {
    IFreeRound,
    ILoyalty,
    IUserInfo,
    ISocketsData,
} from 'wlc-engine/modules/core/system/interfaces';
import {TranslateService} from '@ngx-translate/core';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {EventService} from 'wlc-engine/modules/core/system/services';

import {
    get as _get,
    reduce as _reduce,
    assign as _assign,
    isString as _isString,
    cloneDeep as _cloneDeep,
} from 'lodash-es';

export class UserInfo extends AbstractModel<IUserInfo> {

    public separateLoyalty: boolean = false;
    protected $loyaltyData: ILoyalty = {} as ILoyalty;

    constructor(
        protected translate: TranslateService,
        protected eventService: EventService,
    ) {
        super();
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

    public get freeRounds(): IFreeRound[] {
        return this.data?.freerounds;
    }

    public get freespins(): number{
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
        return this.data.socketsData;
    }

    public get status(): number {
        return this.data?.status;
    }

    public get bonusBalance(): number {
        return _reduce(this.data?.loyalty?.BonusesBalance, (accumulator: number, bonusBalance: number) => {
            return accumulator + Number(_get(bonusBalance, 'Balance', 0));
        }, 0);
    }

    public get realBalance(): number {
        return this.balance - this.bonusBalance;
    }

    public get level(): number {
        return +this.data?.loyalty?.Level || 0;
    }

    public get levelName(): string {
        const defaultLanguage = 'en'; //TODO default lang
        const currentLanguage = this.translate.currentLang;

        return this.data?.loyalty?.LevelName[currentLanguage] || this.data?.loyalty?.LevelName[defaultLanguage];
    }

    public get points(): number {
        return +this.data?.loyalty?.Points || 0;
    }

    public get nextLevelPoints(): number {
        return +this.data?.loyalty?.NextLevelPoints || 0;
    }

    public updateBalance(balance: number): void {
        //TODO update
    }

    public set data(data: IUserInfo) {
        super.data = _cloneDeep(data);
        if (this.separateLoyalty) {
            this.data.loyalty = this.$loyaltyData;
            this.data.loyalty.BonusesBalance = data.loyalty.BonusesBalance;
        } else {
            this.$loyaltyData = this.data.loyalty;
        }
    }

    public get data(): IUserInfo {
        return super.data;
    }

    protected checkData(): void {
        //TODO AFTER RELEASE 13.11.2020
        /*if (!this.data?.status) {
            this.eventService.emit({
                name: 'USER_STATUS_DISABLE',
            });
        }*/
    }
}
