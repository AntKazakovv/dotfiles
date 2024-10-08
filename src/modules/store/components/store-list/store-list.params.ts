import {
    IComponentParams,
    CustomType,
    IPagination,
    IWrapperCParams,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {storeConfig} from 'wlc-engine/modules/store/system/config/store.config';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | 'first' | 'wolf' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IStoreListCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
    userStatsConfig: IWrapperCParams;
    formConfig: IWrapperCParams;
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        byCategories?: boolean;
        pagination?: IPagination;
    };
    filterIconPath?: string;
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
};
