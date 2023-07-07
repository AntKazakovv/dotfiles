import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface ISearchFieldCParams extends IComponentParams<string, string, string> {
    placeholder?: string;
};

export const defaultParams: ISearchFieldCParams = {
    class: 'wlc-search-field',
    moduleName: 'multi-wallet',
    placeholder: gettext('Enter the currency code'),
};
