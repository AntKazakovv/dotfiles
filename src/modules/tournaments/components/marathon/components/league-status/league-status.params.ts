import {
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILeagueStatusCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    league?: League;
    joinCallback?: () => void;
    desktopBtnParams?: IButtonCParams;
    notAvailableStatusMessage?: string,
    successStatusMessage?: string,
}

export const defaultParams: ILeagueStatusCParams = {
    moduleName: 'tournaments',
    componentName: 'wlc-league-status',
    class: 'wlc-league-status',
    desktopBtnParams: {
        common: {
            text: gettext('Join'),
            typeAttr: 'button',
        },
        theme: 'cleared',
        wlcElement: 'button_league-status',
    },
    notAvailableStatusMessage: gettext('Unavailable'),
    successStatusMessage: gettext('Member'),
};
