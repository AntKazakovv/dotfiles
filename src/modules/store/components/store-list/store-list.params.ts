import {
    IComponentParams,
    CustomType,
    IPagination,
    IWrapperCParams,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {storeConfig} from 'wlc-engine/modules/store/system/config/store.config';
import {IStoreItemParams} from 'wlc-engine/modules/store/system/interfaces/store.interface';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'first' | 'wolf' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IStoreListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    modifiers?: Modifiers[];
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    userStatsConfig: IWrapperCParams;
    formConfig: IWrapperCParams;
    common?: {
        themeMod?: ComponentThemeMod;
        customModifiers?: CustomMod;
        byCategories?: boolean;
        pagination?: IPagination;
        storeItemParams?: IStoreItemParams;
    };
    filterIconPath?: string;
    multiWalletAlert?: string;
}

export const defaultParams: IStoreListCParams = {
    moduleName: 'store',
    componentName: 'wlc-store-list',
    class: 'wlc-store-list',
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No store items available'),
                },
            },
        ],
    },
    userStatsConfig: {
        components: [
            {
                name: 'user.wlc-user-stats',
                params: {
                    type: 'store',
                    showTooltipDescriptionModal: true,
                },
            },
        ],
    },
    formConfig: {
        class: 'wlc-form-wrapper',
        components: [
            {
                name: 'core.wlc-select',
                params: storeConfig.storeFilterConfig,
            },
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    name: 'submit',
                    common: {
                        text: gettext('Save'),
                    },
                },
            },
        ],
    },
    multiWalletAlert: gettext('Please note that some transactions are processed only through your main wallet.'),
};
