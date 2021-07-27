import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export type ComponentTheme = 'default' | 'profile' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IReplaceConfig {
    name?: string;
    iconPath?: string;
}

export interface INetwork {
    id: string;
    name: string;
    iconPath: string;
    imgError: boolean;
}

export interface ISocialNetworksCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * The text which title attribute starts with.
     */
    titlePrefix?: string;
    /**
     * Relative gstatc path for icons. Default is 'wlc/icons/social/oauth/', search icons by network id and svg extension.
     *
     * Be responsible, end path with slash.
     */
    iconPath?: string;
    /**
     * Replace networks config.
     *
     * `key` - is id of network (from bootstrap request).
     *
     * `name` - if defined - replace default name of social network.
     *
     * `iconPath` - full path to image, if defined - replace default image path.
     */
    replaceConfig?: IIndexing<IReplaceConfig>;
};

export const defaultParams: ISocialNetworksCParams = {
    class: 'wlc-social-networks',
    componentName: 'wlc-social-networks',
    moduleName: 'user',
    titlePrefix: gettext('Continue with'),
    iconPath: 'wlc/icons/social/oauth/',
    replaceConfig: {
        gp: {
            name: 'Google',
        },
    },
};
