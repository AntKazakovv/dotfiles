import {IFreeRound, ILoyalty, IUserInfo} from 'wlc-engine/interfaces';
import {TranslateService} from '@ngx-translate/core';
import {AbstractModel} from 'wlc-engine/modules/core/models/abstarct.model';
import {EventService} from 'wlc-engine/modules/core/services';

import {
    get as _get,
    reduce as _reduce,
    toString as _toString,
} from 'lodash';

export class UserInfo extends AbstractModel<IUserInfo>  {

    constructor(
        protected translate: TranslateService,
        protected eventService: EventService,
        ) {
            super();
    }

    public get lockExpiresAt(): string {
        return this.data.LockExpiresAt;
    }

    public get affiliateID(): string {
        return this.data.affiliateID;
    }

    public get availableWithdraw(): number {
        return this.data.availableWithdraw;
    }

    public get balance(): number {
        return this.data.balance;
    }

    public get category(): string {
        return this.data.category;
    }

    public get email(): string {
        return this.data.email;
    }

    public get emailHash(): string {
        return this.data.emailHash;
    }

    public get firstName(): string {
        return this.data.firstName;
    }

    public get freeRounds(): IFreeRound[] {
        return this.data.freerounds;
    }

    public get idUser(): string {
        return this.data.idUser;
    }

    public get lastName(): string {
        return this.data.lastName;
    }

    public get loyalty(): ILoyalty {
        return this.data.loyalty;
    }

    public get pinCode(): string {
        return this.data.pincode;
    }

    public get socketsData(): string {
        return this.data.socketsData;
    }

    public get status(): number {
        return this.data.status;
    }

    public get bonusBalance(): number {

        return _reduce(this.data.loyalty.BonusesBalance, (accumulator: number, bonusBalance: number) => {
            return accumulator + Number(_get(bonusBalance, 'Balance', 0));
        }, 0);
    }

    public get realBalance():number {
        return this.balance - this.bonusBalance;
    }

    public get level(): string {
        return this.data.loyalty?.Level;
    }

    public get levelName(): string {
        const defaultLanguage = 'en'; //TODO default lang
        const currentLanguage = this.translate.currentLang;

        return this.data.loyalty?.LevelName[currentLanguage], this.data.loyalty?.LevelName[defaultLanguage], '';
    }

    public get points(): string {
        return this.data.loyalty?.Points, '';
    }

    public get nextLevelPoints(): string {
        return this.data.loyalty.NextLevelPoints, '';
    }

    public updateBalance(balance: number): void {
        //TODO update
    }

    protected checkData(): void {
        if (!this.data.status) {
            this.eventService.emit({
                name: 'USER_STATUS_DISABLE',
            });
        }
    }
}
