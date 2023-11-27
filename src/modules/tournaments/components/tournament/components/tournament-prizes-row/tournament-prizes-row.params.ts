import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITournamentPrize} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | 'history' | CustomType;
export type ComponentThemeMod = 'default' | 'one-line' | 'short-line' | CustomType;

export interface ITournamentPrizesRowCParams
    extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Set currency format 1-2-2 if true.
     * Works for real currencies (not for special, like LP, FB, FS, EP)
     */
    useSmartDemicals?: boolean;
    wins?: ITournamentPrize[];
    shortLineIcon?: string;
};

export const defaultParams: ITournamentPrizesRowCParams = {
    class: 'wlc-tournament-prizes-row',
    componentName: 'wlc-tournament-prizes-row',
    moduleName: 'tournaments',
    useSmartDemicals: false,
    shortLineIcon: '/currency/icon-prizepool.svg',
};
