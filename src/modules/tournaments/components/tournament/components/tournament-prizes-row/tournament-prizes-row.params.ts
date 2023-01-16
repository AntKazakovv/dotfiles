import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'one-line' | CustomType;

export interface ITournamentPrizesRowCParams
    extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
        /** Set currency format 1-2-2 if true.
         * Works for real currencies (not for special, like LP, FB, FS, EP)
         */
        useSmartDemicals?: boolean;
};

export const defaultParams: ITournamentPrizesRowCParams = {
    class: 'wlc-tournament-prizes-row',
    componentName: 'wlc-tournament-prizes-row',
    moduleName: 'tournaments',
    useSmartDemicals: false,
};
