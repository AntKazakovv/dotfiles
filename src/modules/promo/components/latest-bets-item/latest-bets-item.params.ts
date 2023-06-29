import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {LatestBetsModel} from 'wlc-engine/modules/promo/system/models/latest-bets.model';


export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILatestBetsItemCParams extends IComponentParams<Theme, Type, ThemeMod> {
    bet?: LatestBetsModel;
    fallBackIconPath?: string,
}

export const defaultParams: ILatestBetsItemCParams = {
    class: 'wlc-latest-bets-item',
    fallBackIconPath: '//agstatic.com/wlc/latest-bets/fallback.svg',
};
