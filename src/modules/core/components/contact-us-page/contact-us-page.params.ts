import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IContactUsPageCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    imgPath?: string;
}

export const defaultParams: IContactUsPageCParams = {
    moduleName: 'core',
    componentName: 'wlc-contact-us-page',
    class: 'wlc-contact-us-page',
    imgPath: 'static/images/feedback.png',
};
