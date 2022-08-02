import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ICountryAndStateCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    countryCode: ISelectCParams;
    stateCode: ISelectCParams;
}


export const defaultParams: ICountryAndStateCParams = {
    class: 'wlc-country-and-state',
    countryCode: {
        labelText: gettext('Country'),
        common: {
            placeholder: gettext('Country'),
        },
        name: 'countryCode',
        validators: ['required'],
        options: 'countries',
        wlcElement: 'block_country',
        customMod: ['country'],
        useSearch: true,
        insensitiveSearch: true,
        noResultText: gettext('No results available'),
        autocomplete: 'new-password',
    },
    stateCode: {
        labelText: gettext('State'),
        common: {
            placeholder: gettext('State'),
        },
        name: 'stateCode',
        options: 'countryStates',
        wlcElement: 'block_state',
        customMod: ['state'],
    },
};
