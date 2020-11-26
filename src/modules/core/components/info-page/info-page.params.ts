import {IComponentParams} from 'wlc-engine/classes/abstract.component';
import {IWrapperCParams} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';

export type ModeType = 'default';
export type ComponentTheme = 'default';
export type ComponentType = 'default';
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface IInfoPageConfig {
    menu?: IWrapperCParams;
    content?: IWrapperCParams;
}

export interface IInfoPageCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    config?: IInfoPageConfig;
}

export const defaultParams: IInfoPageCParams = {
    class: 'wlc-info-page',
    config: {
        menu: {
            class: 'wlc-info-page__menu',
            components: [
                {
                    name: 'menu.wlc-menu',
                    params: {
                        theme: 'contacts',
                        items: [
                            {
                                name: 'Contact Us',
                                type: 'sref',
                                state: 'app.contacts',
                                stateParams: {
                                    slug: 'feedback',
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'static.wlc-post-menu',
                    params: {
                        theme: 'contacts',
                        common: {
                            categorySlug: 'legal',
                            state: 'app.contacts',
                        },
                    },
                },
            ],
        },
        content: {
            class: 'wlc-info-page__content',
        },
    },
};
