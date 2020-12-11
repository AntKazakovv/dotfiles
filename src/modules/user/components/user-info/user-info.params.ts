import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IUserInfoCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    dropdown: {
        components: ILayoutComponent[]
    }
}

export const defaultParams: IUserInfoCParams = {
    class: 'wlc-user-info',
    wlcElement: 'block_user-stat',
    dropdown: {
        components: [
            {
                name: 'user.wlc-user-stats',
                params: {
                    fields: [
                        'balance',
                        'bonusBalance',
                        'points',
                        'level',
                    ],
                },
            },
            {
                name: 'menu.wlc-profile-menu',
                params: {
                    theme: 'dropdown',
                    themeMod: 'vertical',
                    type: 'dropdown',
                    common: {
                        useArrow: true,
                    },
                },
            },
        ],
    },
};
