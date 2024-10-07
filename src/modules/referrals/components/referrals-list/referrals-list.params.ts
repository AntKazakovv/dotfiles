import {
    IComponentParams,
    CustomType,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IReferralsListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Date format (for showing) */
    filterDateFormat?: string;
    /** Skip or not empty referrals */
    skipEmptyReferrals?: boolean;
    /** Number of rows to show, extra rows available by 'show all' click */
    rowsLimit?: number;
    emptyConfig?: IWrapperCParams;
};

export const defaultParams: IReferralsListCParams = {
    class: 'wlc-referrals-list',
    componentName: 'wlc-referrals-list',
    moduleName: 'referrals',
    filterDateFormat: 'DD.MM.YYYY',
    skipEmptyReferrals: true,
    rowsLimit: 10,
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('You do not have any available referrals yet'),
                },
            },
        ],
    },
};
