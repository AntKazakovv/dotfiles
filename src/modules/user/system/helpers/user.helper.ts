import _findLastIndex from 'lodash-es/findLastIndex';
import _set from 'lodash-es/set';
import _find from 'lodash-es/find';

import {
    IFormWrapperCParams,
    NotificationEvents,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    ConfigService,
    EventService,
    IPushMessageParams,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {IAddProfileInfoCParams} from 'wlc-engine/modules/user/components/add-profile-info/add-profile-info.params';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

interface IDataForModification{
    shift: number;
    config: IFormWrapperCParams;
    selfExcludedText: string;
    enableRequirement: boolean;
}

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

    /**
     * Push message about registration restriction
     *
     * @returns boolean
     */
    public static restrictRegistration(
        configService: ConfigService,
        eventService: EventService,
    ): boolean {
        const restrictReg = configService.get<boolean>('$base.site.restrictRegistration');
        if (restrictReg) {
            eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    message: gettext('Sorry, registration is disabled.'),
                    wlcElement: 'registration-is-disabled',
                },
            });
        }
        return restrictReg;
    }

    public static showInformationModal(modalService: ModalService, modalMessage: string): void {
        modalService.showModal({
            id: 'user-information',
            modalTitle: gettext('Information'),
            modifier: 'confirmation',
            hideIcon: true,
            showConfirmBtn: true,
            confirmBtnText: gettext('Ok'),
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
