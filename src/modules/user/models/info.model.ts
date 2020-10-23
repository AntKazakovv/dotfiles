import {IUserInfo} from 'wlc-engine/interfaces';
import {TranslateService} from '@ngx-translate/core';
import {AbstractUserModel} from 'wlc-engine/modules/user/models/abstarct.model';

import {
    get as _get,
    reduce as _reduce,
    toString as _toString,
} from 'lodash';

export class UserInfo extends AbstractUserModel<IUserInfo>  {

    constructor(
        protected translate: TranslateService,
        ) {
            super();
    }

    public get balance(): number {
        return this.data.balance;
    }

    public get bonusBalance(): number {

        return _reduce(this.data.loyalty.BonusesBalance, (accumulator: number, bonusBalance: number) => {
            return accumulator + Number(_get(bonusBalance, 'Balance', 0));
        }, 0);
    }

    public get realBalance():number {
        return this.balance - this.bonusBalance;
    }

    public get level(): number {
        return _get(this.data, 'loyalty.Level');
    }

    public get levelName(): string {
        const defaultLanguage = 'en'; //TODO default lang
        const currentLanguage = this.translate.currentLang;

        return _get(this.data, `loyalty.LevelName.${currentLanguage}`,
            _get(this.data, `loyalty.LevelName.${defaultLanguage}`, ''));
    }

    public get points(): string {
        return _get(this.data, 'loyalty.Points', '');
    }

    public get nextLevelPoints(): string {
        return _get(this.data, 'loyalty.NextLevelPoints', '');
    }

    public updateBalance(balance: number): void {
        //TODO update
    }
}
