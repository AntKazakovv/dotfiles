import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type BurgerPanelType = 'left' | 'right';
/**
 * fade - simple appearance with fade effect
 *
 * fade-stagger - alternate appearances with fade effect
 *
 * translate-stagger - alternatе appearances with an offset
 *
 * scale-stagger - alternate appearances with zooming
 */
export type BurgerPanelAnimeType = 'fade' | 'fade-stagger' | 'translate-stagger' | 'scale-stagger';

export interface IBurgerPanelCParams extends IComponentParams<string, BurgerPanelType, string> {
    type: BurgerPanelType;
    title?: string;
    showHeader?: boolean;
    useScroll?: boolean;
    showClose?: boolean;
    /**
     * Use this option to customize animation of burger-panels
     */
    animeType?: BurgerPanelAnimeType;
    touchEvents?: {
        use?: boolean;
        onlyMobile?: boolean;
    };
}

export const defaultParams: IBurgerPanelCParams = {
    moduleName: 'core',
    componentName: 'wlc-burger-panel',
    class: 'wlc-burger-panel',
    type: 'left',
    showHeader: true,
    useScroll: true,
    showClose: true,
    animeType: 'fade',
    touchEvents: {
        use: true,
    },
};
