import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
    ProfileType,
} from 'wlc-engine/modules/core';
import {wlcProfileForm} from 'wlc-engine/modules/core/system/config/layouts/components';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type AdditionalBlockItemsType = 'emailNotification' | 'passwordRestore' | 'bankingInfo';

export interface IProfileFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    config: IFormWrapperCParams,
    useProfileBlocks: boolean;
}

export const generateDefaultParams = (profile: ProfileType, useLogin: boolean): IProfileFormCParams => {
    return {
        class: 'wlc-profile-form',
        componentName: 'wlc-profile-form',
        moduleName: 'user',
        useProfileBlocks: false,
        config: profile === 'first'
            ? wlcProfileForm.generateFirstProfileConfig(useLogin)
            : wlcProfileForm.generateDefaultProfileConfig(useLogin),
    };
};
