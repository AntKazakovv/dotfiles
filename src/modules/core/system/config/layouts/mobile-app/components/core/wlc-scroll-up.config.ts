import {ILayoutComponent, IScrollUpParams} from 'wlc-engine/modules/core';

export namespace wlcScrollUp {

    export const def: ILayoutComponent = {
        name: 'core.wlc-scroll-up',
        params: <IScrollUpParams>{
            iconPath: '/wlc/icons/scroll-up.svg',
        },
    };

    export const circle: ILayoutComponent = {
        name: 'core.wlc-scroll-up',
        params: <IScrollUpParams>{
            themeMod: 'circle',
            iconPath: '/wlc/icons/arrow-up.svg',
        },
    };
}
