import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIconParams} from 'wlc-engine/modules/core/system/models/icon-list-item.model';


export type ComponentTheme = 'merchants' | 'payments' | CustomType;
export type ComponentType = 'default' | 'svg';
export type ComponentThemeMod = 'default' | CustomType;

/**
 * @param include
 */
export interface IIconListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    theme: ComponentTheme;
    common?: {
        payment?: {
            include?: string[],
            exclude?: string[],
        },
    }
    items?: IIconParams[];
    imgPlaceholder?: string;
}

export const defaultParams: IIconListCParams = {
    class: 'wlc-icon-list',
    theme: 'merchants',
    imgPlaceholder: '/static/images/placeholder.png',
};
