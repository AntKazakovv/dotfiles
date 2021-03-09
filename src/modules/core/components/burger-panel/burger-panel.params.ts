import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type BurgerPanelType = 'left' | 'right';

export interface IBurgerPanelCParams extends IComponentParams<string, BurgerPanelType, string> {
    type: BurgerPanelType;
    title?: string;
    showHeader?: boolean;
    useScroll?: boolean;
    touchEvents?: {
        use?: true;
        onlyMobile?: boolean;
    };
}

export const defaultParams: IBurgerPanelCParams = {
    class: 'wlc-burger-panel',
    type: 'left',
    showHeader: true,
    useScroll: true,
    touchEvents: {
        use: true,
    },
};
