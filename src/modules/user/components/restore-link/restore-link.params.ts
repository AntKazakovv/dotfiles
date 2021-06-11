import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'cleared' | CustomType;
export type ComponentType = 'default' | 'button' | CustomType;

export interface IRestoreLinkCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
}

export const defaultParams: IRestoreLinkCParams = {
    class: 'wlc-restore-link',
};
