import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IconModel} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type IconErrorCode =  true | '1.4.0' | '1.4.18';

export interface IIconListItemCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    icon?: IconModel;
};

export const defaultParams: Partial<IIconListItemCParams> = {
    class: 'wlc-icon-list-item',
};
