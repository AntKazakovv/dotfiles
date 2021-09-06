import {RawParams, TransitionOptions} from '@uirouter/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentType= 'default' | 'affiliate' | CustomType;

export interface ILogoImageParams {
    /**
     * set the value of the image name, which is set in the 03.files.settings file, where it is set as the name of the * object property, and the value of the object property is the path to the image
     * will not work if the url is set to
     */
    name?: string;
    /**
     * if true, svg will be shown as image
     */
    showSvgAsImg?: boolean;
    /**
     * set the name of the logo in the directory project/roots/static/images
     */
    url?: string;
    /**
     * if there is value, it will be used as second logo on alt site theme. Use this param, if
     * you need to add logo for alternate color theme of your project. Set only file name, without path
     * set the name of the logo in the directory project/roots/static/images
     */
    urlForAltImg?: string;
}

export interface ILogoCParams extends IComponentParams<string, ComponentType, string> {
    /**
     * where will the redirect lead when you click on the logo
     */
    link: string;
    uiOptions?: TransitionOptions;
    uiParams?: RawParams;
    /**
     * if true, the link will lead to the home page without reloading
     */
    disableLink?: boolean;
    /**
     * settings for image
     */
    image?: ILogoImageParams;
    /**
     * opens the link in a new window(works only on affiliate) or redirect current
     */
    target?: '_self' | '_blank';
}

export const defaultParams: ILogoCParams = {
    class: 'wlc-logo',
    /**
     * where will the redirect lead when you click on the logo
     */
    link: 'app.home',
    wlcElement: 'block_logo',
    uiOptions: {
        reload: false,
        inherit: true,
    },
    /**
     * if true, the link will lead to the home page without reloading
     */
    disableLink: false,
    image: {
        url: 'logo.svg',
        showSvgAsImg: false,
    },
    moduleName: 'core',
    componentName: 'wlc-logo',
    /**
     * opens the link in a new window(works only on affiliate) or redirect current
     */
    target: '_self',
};
