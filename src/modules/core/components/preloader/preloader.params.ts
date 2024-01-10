import {
    IComponentParams,
    IDisplayConfig,
    IIndexing,
} from 'wlc-engine/modules/core/system/interfaces';

export type ModifiersType = string;
export type Theme = 'default';
export type ThemeMod = 'default';
export type Type = 'default';

export type ElementType = 'block' | 'line' | 'circle' | 'icon' | 'title' | 'button';
export type EqualSize= 'width' | 'height';

export interface IPreloaderCParams extends IComponentParams<Theme, Type, ThemeMod> {
    block?: IPreloaderBlock;
}

export interface IPreloaderBlock {
    /* type of the element */
    type: ElementType;
    /* styles for the element */
    styles?: IIndexing<string>;
    /* class for the element */
    customClass?: string;
    /* the block will render without container*/
    noContainer?: boolean;
    /* elements params */
    elements?: IPreloaderElement[];
}

export interface IPreloaderElement extends Omit<IPreloaderBlock, 'noContainer'> {
    /* same autosize of width/height for circle element */
    equalSize?: EqualSize;
    /* how many to repeat */
    amount?: number;
    /* icon name for icon element */
    iconName?: string;
    /* display config */
    display?: IDisplayConfig;
}

export const defaultParams: IPreloaderCParams = {
    moduleName: 'core',
    componentName: 'wlc-preloader',
    class: 'wlc-preloader',
    block: {
        type: 'block',
        elements: [
            {
                type: 'line',
                amount: 3,
            },
        ],
    },
};
