import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IPagination,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentThemeMod = 'default' | 'first' | CustomType;

export interface ICashbackRewardCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    pagination?: IPagination;
    claimBtnText?: string;
    claimTimerText?: string;
    noCashbackText?: string;
    /** wlc-profile-no-content params */
    emptyConfig?: IWrapperCParams;
}

export const defaultParams: ICashbackRewardCParams = {
    moduleName: 'cashback',
    componentName: 'wlc-cashback-rewards',
    class: 'wlc-cashback',
    claimBtnText: gettext('Get cashback'),
    claimTimerText: gettext('Will be available in'),
    noCashbackText: gettext('No cashback available'),
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    iconPath: '/wlc/icons/icons_new/empty-table-bg.svg',
                    text: gettext('Sorry, this functionality is currently unavailable'),
                },
            },
        ],
    },
};
