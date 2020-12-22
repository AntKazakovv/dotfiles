import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IUserStatsCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    fields: string[];
}

export const defaultParams: IUserStatsCParams = {
    class: 'wlc-user-stats',
    fields: [
        'balance',
        'bonusBalance',
        'points',
        'level',
        ''
    ],
};
