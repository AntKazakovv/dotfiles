import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Tournament} from 'wlc-engine/modules/tournaments';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITournamentCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    tournament?: Tournament;
    thumbType?: 'string';
}

export const defaultParams: ITournamentCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament',
    componentName: 'wlc-tournament',
};
