import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ISomethingWrongPageCParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    /** Strings of text */
    text?: string;
    buttonText?: string;
    /** Path to image */
    image?: string;
}

export const defaultParams: ISomethingWrongPageCParams = {
    moduleName: 'core',
    componentName: 'wlc-something-wrong-page',
    class: 'wlc-something-wrong-page',
    title: gettext('Something went wrong'),
    text: gettext('Try to reload the page or come back later'),
    buttonText: gettext('Refresh the page'),
    image: 'wlc/decors/error-cat.svg',
};
