import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILeaguePlaceCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    league?: League;
    place?: number;
}

export const defaultParams: ILeaguePlaceCParams = {
    moduleName: 'tournaments',
    componentName: 'wlc-league-place',
    class: 'wlc-league-place',
};
