import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';
import _forEach from 'lodash-es/forEach';
import _remove from 'lodash-es/remove';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    ConfigService,
    EventService,
    IFormWrapperCParams,
    IIndexing,
    IPushMessageParams,
    NotificationEvents,
    ProfileType,
    IFormComponent,
    ValidatorType,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ProfileFormAbstract} from 'wlc-engine/modules/user/system/classes/profile-form.abstract';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';
import {UserHelper} from 'wlc-engine/modules/user/system/helpers/user.helper';

import * as Params from './profile-form.params';

interface IFindBlockResult {
    parent: IFormComponent[];
    index: number;
}

/**
 * Profile form component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-profile-form',
 * }
 *
 */
// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-profile-form]',
    templateUrl: './profile-form.component.html',
    styleUrls: ['./styles/profile-form.component.scss'],
    providers: [
        {
            provide: 'requiredFields',
            deps: [CuracaoRequirement, ConfigService],
            useFactory: (enabled: boolean, config: ConfigService): string[] => {
                if (enabled) {
                    const defaultFieldList = [
                        'profileMail',
                        'firstName',
                        'lastName',
                        'birthDate',
                        'countryAndState',
                        'city',
                        'address',
                        'postalCode',
                    ];
                    const fieldList = config.get<string[]>('$user.requiredByCuracaoFields');
                    if (fieldList) {
                        return GlobalHelper.sortByOrder(fieldList, defaultFieldList);
                    }
                    return defaultFieldList;
                }
                return [];
            },
        },
    ],
})
export class ProfileFormComponent extends ProfileFormAbstract implements OnInit {
    @Input() protected inlineParams: Params.IProfileFormCParams;
    public $params: Params.IProfileFormCParams;
    public userProfile = this.userService.userProfile$;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);
    public ready: boolean = false;
    public formConfig: IFormWrapperCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IProfileFormCParams,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected configService: ConfigService,
        @Inject('requiredFields') protected requiredFields: (keyof typeof FormElements)[],
    ) {
        super(
            {
                injectParams: params,
                defaultParams: Params.generateDefaultParams(
                    configService.get<ProfileType>('$base.profile.type'),
                    configService.get<boolean>('$base.site.useLogin'),
                ),
            },
            eventService,
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.configService.ready;

        await this.userService.fetchUserProfile();

        this.formConfig = _cloneDeep(this.$params.config);

        this.mixinRequiredFields();

        if (await this.configService.get<Promise<boolean>>('$user.skipPasswordOnFirstUserSession')) {
            this.formConfig = this.changePassBlock();
        }

        await this.updateFormForMetamask();

        this.ready = true;
        this.cdr.detectChanges();
    }

    /**
     * Save profile form
     *
     * @param form {FormGroup}
     * @returns save status
     */
    public async ngSubmit(form: FormGroup): Promise<boolean> {
        const {pep} = form.value;

        delete form.value['pep'];

        if (pep) {
            form.value.extProfile = _assign({}, form.value.extProfile, {pep});
        }

        const result = await this.userService.updateProfile(form.value, false);

        if (result === true) {
            form.controls.password?.setValue('');
            form.controls.newPasswordRepeat?.setValue('');
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Profile updated successfully'),
                    message: gettext('Your profile has been updated successfully'),
                    wlcElement: 'notification_profile-update-success',
                },
            });
            this.cdr.detectChanges();

            return true;
        } else {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: result.errors,
                    wlcElement: 'notification_profile-update-error',
                },
            });

            if (_isObject(result.errors)) {
                this.errors$.next(result.errors as IIndexing<string>);
            }

            return false;
        }
    }

    protected mixinRequiredFields(): void {
        let prev = {
            parent: this.formConfig.components,
            index: 0,
        };

        this.findFirstRealIndex(prev);

        const getField = (fieldParams: IFindBlockResult, name: keyof typeof FormElements): IFormComponent => {
            let item: IFormComponent;
            if (fieldParams) {
                item = fieldParams.parent[fieldParams.index];
                prev = fieldParams;
            } else {
                if (this.configService.get<ProfileType>('$base.profile.type') === 'first') {
                    item = GlobalHelper.mergeConfig(
                        FormElements[name],
                        {
                            params: {
                                theme: 'vertical',
                            },
                        },
                    );
                } else {
                    item = FormElements[name];
                }

                if (name === 'countryAndState') {
                    const locationBlock = this.findBlock(
                        this.$params.config.components,
                        'block',
                        'core.wlc-wrapper',
                        'location',
                    );
                    if (locationBlock) {
                        prev = locationBlock;
                    }
                }
                prev.parent.splice(prev.index, 0, item);
                prev.index++;
            }

            return item;
        };

        for (let i = 0; i < this.requiredFields.length; i++) {

            if (i && !prev.index) {
                prev.index = prev.parent.length;
            }

            let fieldParams: IFindBlockResult;

            switch (this.requiredFields[i]) {
                case 'countryAndState':
                case 'birthDate':
                case 'profileMail':
                    fieldParams = this.findBlock(
                        this.$params.config.components,
                        'block',
                        FormElements[this.requiredFields[i]].name,
                    );
                    break;
                default:
                    const fieldName = _get(FormElements, `${this.requiredFields[i]}.params.name`);

                    if (!fieldName) {
                        break;
                    }

                    fieldParams = this.findBlock(
                        this.$params.config.components,
                        'field',
                        fieldName,
                    );
                    break;
            }
            const item: IFormComponent = getField(fieldParams, this.requiredFields[i]);
            UserHelper.setValidatorsFormElementsForCuracaoWlc(this.requiredFields[i], item);
        }
    }

    protected findBlock(
        components: IFormComponent[],
        type: 'block' | 'field',
        name: string,
        withClassModifier?: string,
    ): IFindBlockResult | null {
        const path = type === 'block' ? 'name' : 'params.name';
        let res: IFindBlockResult | null = null;
        const dfs = (parent: IFormComponent[]): void => {
            for (let i = 0; i < parent.length; i++) {
                if (res) {
                    return;
                }
                if (_get(parent[i], path) === name) {
                    if (withClassModifier) {
                        if (_get(parent[i], 'params.class', '').includes(withClassModifier)) {
                            res = {
                                parent: parent[i].params.components,
                                index: 0,
                            };
                            this.findFirstRealIndex(res);
                            return;
                        }
                    } else {
                        res = {
                            parent,
                            index: i,
                        };
                        return;
                    }
                }
                if (parent[i]?.name.endsWith('wlc-wrapper')) {
                    dfs(parent[i].params.components);
                }
            }
        };
        dfs(components);
        return res;
    }

    protected findFirstRealIndex(blockResult: IFindBlockResult): void {
        while (!blockResult.parent[blockResult.index]
            || blockResult.parent[blockResult.index].name.endsWith('wlc-title')
        ) {
            blockResult.index++;
        }

        if (blockResult.parent[blockResult.index].name.endsWith('wlc-wrapper')) {
            blockResult.parent = blockResult.parent[blockResult.index].params.components;
            if (blockResult.parent[blockResult.index].name.endsWith('wlc-title')) {
                blockResult.index++;
            }
        }
    }

    protected changePassBlock(): IFormWrapperCParams {
        const configClone = _cloneDeep(this.$params.config);
        this.findAndDeletePassBlock(configClone.components);
        if (this.configService.get<ProfileType>('$base.profile.type') === 'first') {
            _remove(configClone.validators, (validator: ValidatorType): boolean => {
                return (typeof validator !== 'string') && (validator.name === 'matchingFields');
            });
        }

        return configClone;
    }

    protected findAndDeletePassBlock(components: IFormComponent[], parent?: IFormComponent): void {
        _forEach(components, (component: IFormComponent): void | false => {
            if (!component) return;

            if (component.name === 'core.wlc-wrapper') {
                this.findAndDeletePassBlock(component.params.components, component);
                return;
            }

            if (component.params.name === 'currentPassword') {
                if (this.configService.get<ProfileType>('$base.profile.type') === 'first') {
                    parent.params.components = [
                        {
                            name: 'core.wlc-button',
                            params: {
                                class: 'wlc-btn',
                                common: {
                                    text: gettext('Change password'),
                                    typeAttr: 'button',
                                    event: {
                                        name: 'SHOW_MODAL',
                                        data: 'changePassword',
                                    },
                                },
                            },
                        },
                    ];
                } else {
                    _remove(components, (comp: IFormComponent): boolean => comp?.params.name === 'currentPassword');
                }

                return false;
            }
        });
    }
}
