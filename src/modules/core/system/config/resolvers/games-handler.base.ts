import {
    Transition,
} from '@uirouter/core';

import {
    BehaviorSubject,
    firstValueFrom,
} from 'rxjs';

import {first} from 'rxjs/operators';
import _cloneDeep from 'lodash-es/cloneDeep';
import _toNumber from 'lodash-es/toNumber';
import _merge from 'lodash-es/merge';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {Deferred} from 'wlc-engine/modules/core/system/classes';
import {
    FormElements,
    TTemplateName,
    formFieldTemplates,
} from 'wlc-engine/modules/core/system/config/form-elements';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import {
    IAddProfileInfoCParams,
    UserHelper,
    UserProfile,
} from 'wlc-engine/modules/user';
import {MerchantFieldsService} from 'wlc-engine/modules/games';
import {RejectReason} from 'wlc-engine/modules/core/system/config/resolvers/start-game.resolver';
import {IModalConfig} from 'wlc-engine/modules/core/system/interfaces/modal.interface';

export class BaseGamesHandler {
    protected merchantFieldsService: MerchantFieldsService;
    protected merchantId: number;
    protected modalProfileInfo: IModalConfig = {
        id: 'add-profile-info',
        modifier: 'add-profile-info',
        componentName: 'user.wlc-add-profile-info',
        componentParams: <IAddProfileInfoCParams>{},
        showFooter: false,
        dismissAll: true,
        backdrop: 'static',
    };

    constructor(
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected transition: Transition,
        protected injectionService: InjectionService,
    ) {
        this.init();
    }

    protected async init(): Promise<void> {
        this.merchantFieldsService = await this.injectionService
            .getService<MerchantFieldsService>('games.merchant-fields-service');
        this.merchantId = _toNumber(this.transition.params().merchantId);
    }

    /**
     * Check user fields
     *
     * @returns {Promise}
     */
    protected async checkUserFields(): Promise<void> {
        const defered = new Deferred<void>();

        const userProfile: UserProfile = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
                .pipe(first(v => !!v?.idUser)),
        );

        this.merchantFieldsService.checkRequiredFields(this.merchantId).then((): void => {
            defered.resolve();
        }, async (emptyFields: string[]): Promise<void> => {

            const components: IFormComponent[] = [];

            if (emptyFields.length > 1) {
                emptyFields.sort((a, b) => formFieldTemplates[a].displayOrder - formFieldTemplates[b].displayOrder);
            }

            emptyFields.forEach((field) => {
                const templateName: TTemplateName = formFieldTemplates[field]?.template;
                const component: IFormComponent = _cloneDeep(FormElements[templateName]);
                UserHelper.setValidatorRequired(templateName, component);
                components.push(component);
            });

            if (!await this.configService.get<Promise<boolean>>('$user.skipPasswordOnFirstUserSession')
                && userProfile.type !== 'metamask'
            ) {
                components.push(FormElements.password);
            }

            components.push(FormElements.submit);

            this.modalService.showModal(_merge(this.modalProfileInfo, {
                componentParams: <IAddProfileInfoCParams>{
                    formConfig: {
                        components,
                    },
                    redirect: {
                        success: {
                            to: this.transition.$to(),
                            params: this.transition.params(),
                        },
                    },
                },
            }));

            defered.reject(RejectReason.EmptyRequiredFields);
        });
        return defered.promise;
    }
}
