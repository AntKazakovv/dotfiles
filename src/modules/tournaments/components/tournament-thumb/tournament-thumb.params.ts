import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Tournament} from 'wlc-engine/modules/tournaments';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITournamentThumbCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    tournament?: Tournament;
    thumbType?: 'string';
}

export const defaultParams: ITournamentThumbCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-thumb',
    componentName: 'wlc-tournament-thumb',
};
