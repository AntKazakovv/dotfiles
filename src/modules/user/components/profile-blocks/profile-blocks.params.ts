import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IInputCParams,
    ISelectCParams,
    IButtonCParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | 'wolf' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IFieldComponentParams {
    /**
     * Form components params
     */
    params: IInputCParams | ISelectCParams;
}

export interface IProfileBlocksCParams extends IComponentParams<Theme, Type, ThemeMod> {
    profileBlockPassword?: {
        title?: string,
        subtitle?: string,
        buttonParams?: IButtonCParams,
    };
    profileBlockBankInfo?: {
        title?: string,
        subtitle?: string,
        buttonParams?: IButtonCParams,
    };
    profileBlockAutoLogout?: {
        title?: string,
        subtitle?: string,
        buttonParams?: IButtonCParams,
    };
}

export const defaultParams: IProfileBlocksCParams = {
    class: 'wlc-profile-blocks',
    componentName: 'wlc-profile-blocks',
    moduleName: 'user',
    profileBlockPassword: {
        title: gettext('Password'),
        subtitle: gettext('You can change your password here.'),
        buttonParams: {
            wlcElement: 'button_change-password',
            common: {
                text: gettext('Change'),
                iconPath: 'wlc/icons/icons_new/arrow.svg',
            },
        },
    },
    profileBlockBankInfo: {
        title: gettext('Banking information'),
        subtitle: gettext('You can add your banking information here.'),
        buttonParams: {
            wlcElement: 'button_add-banking-info',
            common: {
                text: gettext('Add info'),
                iconPath: 'wlc/icons/icons_new/arrow.svg',
            },
        },
    },
    profileBlockAutoLogout: {
        title: gettext('Automatic logout'),
        subtitle: gettext('You can set the time of automatic logout if you were inactive on the site'),
        buttonParams: {
            wlcElement: 'button_change-auto-logout',
            common: {
                text: gettext('Change'),
                iconPath: 'wlc/icons/icons_new/arrow.svg',
            },
        },
    },
};
