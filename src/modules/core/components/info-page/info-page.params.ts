import {
    IComponentParams,
    IIndexing,
    ILayoutComponent,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

export type ModeType = 'default';
export type ComponentTheme = 'default';
export type ComponentType = 'default';
export type AutoModifiersType = ComponentTheme | ModeType;
export type ManualModifiersType = '';
export type ModifiersType = AutoModifiersType & ManualModifiersType & string;

export interface IInfoPageConfig {
    menu?: IWrapperCParams;
    content?: IWrapperCParams;
    menuWolf?: IWrapperCParams;
}

export interface IInfoPageCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    config?: IInfoPageConfig;
    useFaqAccordion?: boolean;
    customConfig?: IIndexing<ILayoutComponent[]>;
    //Only for wolfTheme.
    title?: string,
}

const contacts: ILayoutComponent = {
    name: 'menu.wlc-menu',
    params: {
        theme: 'contacts',
        items: [
            {
                name: 'Contact us',
                type: 'sref',
                params: {
                    state: {
                        name: 'app.contacts',
                        params: {
                            slug: 'feedback',
                        },
                    },
                },
            },
        ],
    },
};

const postMenu = {
    name: 'menu.wlc-post-menu',
    params: {
        theme: 'contacts',
        common: {
            categorySlug: 'legal',
            exclude: ['feedback'],
            state: 'app.contacts',
            parseAsPlainHTML: true,
        },
    },
};

function addIf(
    component: ILayoutComponent, 
    components: ILayoutComponent[],
    predicate: boolean, 
): ILayoutComponent[] 
{
    if (predicate) {
        components.push(component);
    }
    return components;
}

const generateComponent = (isSeparatedPage: boolean): ILayoutComponent[] => {
    const defaultComponents: ILayoutComponent[] = [postMenu];

    return addIf( contacts, defaultComponents, isSeparatedPage);    
};

export const generateConfig = (isSeparatedPage?: boolean): IInfoPageConfig => {
    return {
        menu: {
            class: 'wlc-info-page__menu',
            components: generateComponent(isSeparatedPage),
        },
        menuWolf: {
            class: 'wlc-info-page__menu',
            components: [
                {
                    name: 'menu.wlc-info-page-menu',
                },
            ],
        },
        content: {
            class: 'wlc-info-page__content',
        },
    };
};

export const defaultParams: IInfoPageCParams = {
    class: 'wlc-info-page',
    moduleName: 'core',
    componentName: 'wlc-info-page',
    useFaqAccordion: false,
    title: gettext('Information'),
};
