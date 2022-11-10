import _findLastIndex from 'lodash-es/findLastIndex';
import _set from 'lodash-es/set';
import _find from 'lodash-es/find';

import {IFormWrapperCParams} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {GlobalHelper} from 'wlc-engine/modules/core';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

interface IDataForModification{
    shift: number;
    config: IFormWrapperCParams;
    selfExcludedText: string;
    enableRequirement: boolean;
}

export class UserHelper {

    // Aliases for form elements in game resolver
    public static emptyFieldsAlias = {
        birthDay: 'birthDate',
        birthMonth: 'birthDate',
        birthYear: 'birthDate',
        countryCode: 'countryAndState',
        stateCode: 'state',
    };

    // required fields for game play for curacao wlc
    public static requiredFieldsForCuracaoWlc = [
        'email',
        'firstName',
        'lastName',
        'birthDay',
        'birthMonth',
        'birthYear',
        'countryCode',
        'stateCode',
        'city',
        'address',
    ];

    /**
     * Set a validator form elements for curacao license
     *
     * @param {string} fieldName form element name
     * @param {IFormComponent} formElement form element
     * @returns void
     */
    public static setValidatorsFormElementsForCuracaoWlc(fieldName: string, formElement: IFormComponent): void {
        switch (fieldName) {
            case 'countryAndState': {
                if (!formElement.params?.validatorsField) {
                    _set(formElement, 'params.validatorsField', []);
                }
                if (!_find(formElement.params.validatorsField, {name: 'countryCode', validators: 'required'})) {
                    formElement.params.validatorsField.push({name: 'countryCode', validators: 'required'});
                }
                if (!_find(formElement.params.validatorsField, {name: 'stateCode', validators: 'required'})) {
                    formElement.params.validatorsField.push({name: 'stateCode', validators: 'required'});
                }

                formElement.params = GlobalHelper.mergeConfig(formElement.params, {
                    countryCode: {
                        validators: ['required'],
                    },
                    stateCode: {
                        validators: ['required'],
                    },
                });
                break;
            }
            case 'postalCode':
                break;
            default: {
                if (!formElement.params.validators) {
                    formElement.params.validators = [];
                }
                if (!formElement.params.validators.includes('required')) {
                    formElement.params.validators.push('required');
                }
                break;
            }
        }
    }
    /**
     * Set a registration form elements for license
     *
     * @param {IDataForModification} data
     * @returns void
     */
    public static modifyFormByLicense(data: IDataForModification): void {
        if (data.enableRequirement) {

            const components = data.config.components.slice();

            const getInsertIndex = (): number => {
                const lastCheckbox = _findLastIndex(
                    data.config.components,
                    (item) => item.name === 'core.wlc-checkbox',
                );
                return lastCheckbox === -1
                    ? data.config.components.length
                    : lastCheckbox + data.shift;
            };

            if (_findLastIndex(components, (item) => item.params.name === 'agreeWithSelfExcluded') === -1) {
                components.splice(
                    getInsertIndex(),
                    0,
                    {
                        name: 'core.wlc-checkbox',
                        params: {
                            name: 'agreeWithSelfExcluded',
                            text: data.selfExcludedText
                                || gettext('I have not self-excluded from any gambling website in the past 12 months'),
                            wlcElement: 'block_self_excluded',
                            common: {
                                customModifiers: 'self-exclude',
                            },
                            validators: ['requiredTrue'],
                        },
                    },
                );
            }

            if (_findLastIndex(components, (item) => item.params.name === 'agreedWithTermsAndConditions') === -1) {
                components.splice(getInsertIndex(), 0, FormElements.terms);
            }

            if (_findLastIndex(components, (item) => item.params.name === 'ageConfirmed') === -1) {
                components.splice(getInsertIndex(), 0, FormElements.age);
            }

            data.config.components = components;
        }
    }
}
