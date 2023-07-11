import _cloneDeep from 'lodash-es/cloneDeep';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';
import {TFormCompositeComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export type TDependentFields = 'stateCode' | 'cpf' | 'cnp';

export interface ICountryAndStateCParams extends
    IComponentParams<ComponentTheme, ComponentType, string>,
    TFormCompositeComponent<'countryCode' | TDependentFields>
{
    countryCode: ISelectCParams;
    stateCode: ISelectCParams;
    cpf: IInputCParams;
    cnp: IInputCParams;
}


export const defaultParams: Partial<ICountryAndStateCParams> = {
    class: 'wlc-country-and-state',
    componentName: 'wlc-country-and-state',
    moduleName: 'core',
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
    cpf: _cloneDeep(FormElements.cpf.params),
    cnp: _cloneDeep(FormElements.cnp.params),
};
