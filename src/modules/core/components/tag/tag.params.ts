import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default'  | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ITagList<T extends string> {
        useIcons: boolean;
        tagList: Partial<Record<T, ITagCommon>>
}
export interface ITagCommon {
    caption: string;
    bg?: string;
    iconUrl?: string;
}

export interface ITagCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    common: ITagCommon;
};

export const defaultParams: ITagCParams = {
    class: 'wlc-tag',
    componentName: 'wlc-tag',
    moduleName: 'core',
    common: {
        caption: '',
    },
};
