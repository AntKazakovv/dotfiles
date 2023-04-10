import {
    CustomType,
    IButtonCParams,
    ICheckboxCParams,
    IComponentParams,
    IPushMessageParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IGamblingBanModalTitle {
    text: string;
}

export interface IGamblingBanModalMain {
    text: string;
}

export interface IGamblingBanModalText {
    title?: string;
    primary?: string;
}

export type TGamblingBanModalCheckboxConfig = Omit<ICheckboxCParams, 'control'>;

export interface IGamblingModalConfirmation {
    checkbox?: TGamblingBanModalCheckboxConfig;
}

export interface IGamblingBanModalAction {
    button?: IButtonCParams;
}

export interface IGamblingBanModalActions {
    confirm?: IGamblingBanModalAction;
    signOut?: IGamblingBanModalAction;
}

export interface IGamblingBanModalNotifications {
    fail?: IPushMessageParams;
}

export interface IGamblingBanModalParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    actions?: IGamblingBanModalActions;
    confirmation?: IGamblingModalConfirmation;
    main?: IGamblingBanModalMain;
    notifications?: IGamblingBanModalNotifications;
    title?: IGamblingBanModalTitle;
}

const primaryText = gettext(
    'We inform you that subject to subsection 15(2A) ' +
    'of the Australian Interactive Gambling Act 2001 it is prohibited ' +
    'to provide the service for customers who are physically present in Australia. ' +
    'By continuing you confirm that you are not physically present in Australia ' +
    'and you have been informed that it is illegal to access the service ' +
    'while residing in Australia.',
);

export const defaultParams: IGamblingBanModalParams = {
    class: 'gambling-ban-modal',
    componentName: 'gambling-ban-modal',
    moduleName: 'gambling-ban',
    title: {
        text: gettext('Gambling ban in Australia'),
    },
    main: {
        text: primaryText,
    },
    confirmation: {
        checkbox: {
            common: {checkedDefault: false},
            text: gettext('I confirm I am not physically present in Australia'),
            textSide: 'right',
        },
    },
    actions: {
        confirm: {
            button: {
                theme: 'default',
                common: {text: gettext('Ok')},
            },
        },
        signOut: {
            button: {
                theme: 'cleared',
                themeMod: 'textonly',
                common: {text: gettext('Sign out')},
            },
        },
    },
    notifications: {
        fail: {
            type: 'error',
            title: gettext('Error'),
            message: gettext('You must confirm the requirements'),
        },
    },
};
