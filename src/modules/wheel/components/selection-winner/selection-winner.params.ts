import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IWinner} from 'wlc-engine/modules/wheel/system/interfaces';
import {ParticipantModel} from 'wlc-engine/modules/wheel/system/models';


export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISelectionWinnerCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    numberParticipants?: number;
    competitionAmount?: number;
    currency?: string;
    numberWinners?: number;
    participants?: ParticipantModel[];
    winners?: IWinner[];
    arrowPath?: string;
}

export const defaultParams: ISelectionWinnerCParams = {
    moduleName: 'wheel',
    componentName: 'wlc-selection-winner',
    class: 'wlc-selection-winner',
    arrowPath: '/wlc/prize-wheel/arrow-win.svg',
};
