import {UntypedFormControl} from '@angular/forms';

import {
    IComponentParams,
    CustomType,
    IInputCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface INicknameIconEditCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    nickInputParams: IInputCParams,
};

export interface IIcon {
    path: string,
    isChosen: boolean,
};

export const defaultParams: INicknameIconEditCParams = {
    class: 'wlc-nickname-icon-edit',
    componentName: 'wlc-nickname-icon-edit',
    moduleName: 'user',
    nickInputParams: {
        name: 'userIcon',
        theme: 'default',
        common: {
            placeholder: gettext('Nickname'),
        },
        control: new UntypedFormControl(''),
        validators: ['maxLength'],
    },
};
