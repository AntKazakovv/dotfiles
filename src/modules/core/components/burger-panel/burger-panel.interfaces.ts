import {
    IFixedPanelSizes,
    TFixedPanelState,
} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import {IComponentParams} from 'wlc-engine/modules/core';

export type BurgerPanelType = 'left' | 'right' | 'left-fixed' | 'right-fixed';
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

export interface IFixedPanelAppearanceParams {
    value?: TFixedPanelState;
    params?: IFixedPanelSizes;
};

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
    showLogo?: boolean;
}
