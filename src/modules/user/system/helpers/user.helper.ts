import _set from 'lodash-es/set';
import _find from 'lodash-es/find';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';


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
}
