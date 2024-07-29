import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = TagTheme | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'rtp' | CustomType;
export type TagTheme = 'default' | 'flag' | 'text';

export interface ITagList<T extends string> {
    useIcons: boolean;
    tagList: Partial<Record<T, ITagCommon>>
}
export interface ITagCommon {
    caption?: string;
    bg?: string;
    iconUrl?: string;
    flagIconUrl?: string;
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
        flagIconUrl: '/wlc/icons/theme-wolf/flag.svg',
    },
};
