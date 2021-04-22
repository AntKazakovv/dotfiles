import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type BurgerPanelType = 'left' | 'right';

export interface IBurgerPanelCParams extends IComponentParams<string, BurgerPanelType, string> {
    type: BurgerPanelType;
    title?: string;
    showHeader?: boolean;
    useScroll?: boolean;
    showClose?: boolean;
    touchEvents?: {
        use?: boolean;
        onlyMobile?: boolean;
    };
}

export const defaultParams: IBurgerPanelCParams = {
    class: 'wlc-burger-panel',
    type: 'left',
    showHeader: true,
    useScroll: true,
    showClose: true,
    touchEvents: {
        use: true,
    },
};
