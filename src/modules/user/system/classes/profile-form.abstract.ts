import {Directive} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {
    BehaviorSubject,
    first,
    firstValueFrom,
} from 'rxjs';
import _some from 'lodash-es/some';
import _keys from 'lodash-es/keys';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isObject from 'lodash-es/isObject';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IFormWrapperCParams,
    IIndexing,
    IMixedParams,
    IPushMessageParams,
    NotificationEvents,
    ValidatorType,
} from 'wlc-engine/modules/core';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

@Directive()
export abstract class ProfileFormAbstract extends AbstractComponent {
    public abstract formConfig: IFormWrapperCParams;

    constructor(
        mixedParams: IMixedParams<unknown>,
        protected eventService: EventService,
        protected configService?: ConfigService,
    ) {
        super(mixedParams, configService);
    }

    /**
     * Method is called before submit form
     * @param form {FormGroup}
     * @returns {boolean} boolean
     */
    public beforeSubmit(form: FormGroup, initialFormValues: IIndexing<any>): boolean {
        const isNewValues = _some(
            _keys(form.value),
            (key: string) => {
                if (key === 'currentPassword') {
                    return false;
                }

                return form.value[key] !== initialFormValues[key];
            },
        );

        if (!isNewValues) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Info'),
                    message: gettext('There are no changes to save'),
                    wlcElement: 'notification_profile-update-error',
                },
            });
        }

        return isNewValues;
    }

    /**
     * Check if user type - metamask and update form
     * @returns result - if form was changed - returns true, else returns false
     */
    public async updateFormForMetamask(): Promise<boolean> {
        const userProfile: UserProfile = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
                .pipe(first(v => !!v?.idUser)),
        );

        if (userProfile.type === 'metamask') {
            this.formConfig = this.removePassword();
            return true;
        } else {
            return false;
        }
    }

    protected removePassword(): IFormWrapperCParams {
        const tempForm: IFormWrapperCParams = _cloneDeep(this.formConfig);

        const filterComponents = (components: IFormComponent[]): IFormComponent[] => {
            return components.filter((component: IFormComponent) => {
                if (component && component.name === 'core.wlc-wrapper') {
                    if (component.blockName === 'password-block') {
                        return false;
                    } else {
                        component.params.components = filterComponents(component.params.components);
                        return true;
                    }
                } else if (!component
                    || component.name === 'core.wlc-input'
                    && component.params.name === 'currentPassword'
                ) {
                    return false;
                }
                return true;
            });
        };

        tempForm.components = filterComponents(tempForm.components);
        if (tempForm.validators?.length) {
            tempForm.validators = tempForm.validators.filter((validator: ValidatorType): boolean => {
                if (_isObject(validator)) {
                    return validator.name !== 'matchingFields';
                } else {
                    return true;
                }
            });
        }
        return tempForm;
    }
}
