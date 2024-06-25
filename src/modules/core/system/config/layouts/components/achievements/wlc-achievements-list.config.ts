import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
export namespace wlcAchievementsList {

    export const def: ILayoutComponent = {
        name: 'achievements.wlc-achievement-list',
        params: {
            themeMod: 'default',
            itemParams: {
                infoIconPath: '/wlc/icons/info.svg',
                modalTheme: 'modal',
            },
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'achievements.wlc-achievement-list',
        params: {
            themeMod: 'wolf',
            itemParams: {
                infoIconPath: '/wlc/icons/theme-wolf/interface/info.svg',
                modalTheme: 'modal-wolf',
            },
        },
    };
};
