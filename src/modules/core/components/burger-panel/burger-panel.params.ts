import {IComponentParams} from 'wlc-engine/classes/abstract.component';

export type BurgerPanelType = 'left' | 'right';

export interface IBurgerPanelCParams extends IComponentParams<string, BurgerPanelType, string> {
    type: BurgerPanelType;
    title?: string;
    touchEvents?: {
        use?: true;
        onlyMobile?: boolean;
    };
};

export const defaultParams: IBurgerPanelCParams = {
    class: 'wlc-burger-panel',
    type: 'left',
    touchEvents: {
        use: true,
    },
};
