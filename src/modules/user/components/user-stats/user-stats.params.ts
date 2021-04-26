import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IUserStatsCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    fields?: string[];
    type?: ComponentType;
    theme?: ComponentTheme;
    useDepositBtn?: boolean;
}

export const defaultParams: IUserStatsCParams = {
    class: 'wlc-user-stats',
    moduleName: 'user',
    componentName: 'wlc-user-stats',
    fields: [
        'balance',
        'bonusBalance',
        'points',
        'level',
    ],
};
