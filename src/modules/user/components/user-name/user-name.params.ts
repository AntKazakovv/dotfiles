import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IUserNameCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
}

export const defaultParams: IUserNameCParams = {
    class: 'wlc-user-name',
};
