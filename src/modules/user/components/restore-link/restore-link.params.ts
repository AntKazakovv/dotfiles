import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IRestoreLinkCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
}

export const defaultParams: IRestoreLinkCParams = {
    class: 'wlc-restore-link',
};
