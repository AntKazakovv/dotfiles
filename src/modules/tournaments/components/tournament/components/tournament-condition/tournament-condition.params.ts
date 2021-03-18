import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionType} from 'wlc-engine/modules/tournaments';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITournamentConditionCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        userBalance?: number;
        feeAmount?: number;
        text: string;
        actionType?: ActionType;
    }
}


export const defaultParams: ITournamentConditionCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-condition',
    componentName: 'wlc-tournament-condition',
};
