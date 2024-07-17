import _set from 'lodash-es/set';
import _find from 'lodash-es/find';

import {
    GlobalHelper,
    FormElements,
} from 'wlc-engine/modules/core';
import {
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {IAddProfileInfoCParams} from 'wlc-engine/modules/user/components/add-profile-info/add-profile-info.params';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

export class UserHelper {

    /**
     * Set a validator form elements
     *
     * @param {string} fieldName form element name
     * @param {IFormComponent} formElement form element
     * @returns void
     */
    public static setValidatorRequired(fieldName: string, formElement: IFormComponent): void {
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

                if (formElement.params.locked?.length) {
                    formElement.params.locked.push('stateCode');
                }

                break;
            }
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

    public static showInformationModal(modalService: ModalService, modalMessage: string): void {
        modalService.showModal({
            id: 'user-information',
            modalTitle: gettext('Information'),
            modifier: 'confirmation',
            hideIcon: true,
            showConfirmBtn: true,
            confirmBtnText: gettext('OK'),
            rejectBtnVisibility: false,
            modalMessage: [
                modalMessage,
                gettext('You have been logged out from all devices except the current one for security reasons'),
            ],
            textAlign: 'center',
            dismissAll: true,
        });
    }

    public static showAutoLogoutFormModal(modalService: ModalService, userService: UserService): void {
        modalService.showModal({
            id: 'auto-logout',
            modifier: 'auto-logout',
            componentName: 'user.wlc-add-profile-info',
            componentParams: <IAddProfileInfoCParams>{
                title: gettext('Automatic logout'),
                description: gettext(
                    'You can set the time of automatic logout if you were inactive on the site',
                ),
                formConfig: {
                    class: 'wlc-form-wrapper',
                    components: [
                        FormElements.logoutTime,
                        FormElements.submit,
                    ],
                },
                formData: userService.userProfile$,
            },
            showFooter: false,
            backdrop: true,
        });
    }
}
