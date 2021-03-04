import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcCategoryPreview {
    export const mobileDef: ILayoutComponent = {
        name: 'games.wlc-category-preview',
        display: {
            before: 720,
        },
    };
    export const desktopDef: ILayoutComponent = {
        name: 'games.wlc-category-preview',
        display: {
            after: 900,
        },
    };
}
