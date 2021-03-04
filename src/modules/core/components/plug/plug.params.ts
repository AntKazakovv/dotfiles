import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes';

export type ComponentTheme = 'tournaments' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IPlugCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    label?: string;
    title?: string;
    description?: string;
}

export const defaultParams: Partial<IPlugCParams> = {
    class: 'wlc-plug',
    theme: 'tournaments',
};
