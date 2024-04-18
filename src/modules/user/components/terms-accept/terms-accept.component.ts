import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    Optional,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {
    StateService,
    UIRouterGlobals,
} from '@uirouter/core';

import {
    AbstractComponent,
    ModalService,
    EventService,
    NotificationEvents,
    IPushMessageParams,
    ConfigService,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    TermsAcceptService,
    IValidateData,
} from 'wlc-engine/modules/user/system/services/terms/terms-accept.service';
import {WlcModalComponent} from 'wlc-engine/standalone/core/components/modal/modal.component';

import * as Params from './terms-accept.params';

@Component({
    selector: '[wlc-terms-accept]',
    templateUrl: './terms-accept.component.html',
    styleUrls: ['./styles/terms-accept.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptTermsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITermsAcceptCParams;

    public override $params: Params.ITermsAcceptCParams;
    public config: IFormWrapperCParams;

    constructor(
        @Inject('injectParams')
        protected injectParams: Params.ITermsAcceptCParams,
        @Optional() @Inject(WlcModalComponent)
        protected modal: WlcModalComponent,
        protected modalService: ModalService,
        protected eventService: EventService,
        configService: ConfigService,
        protected termsAcceptService: TermsAcceptService,
        protected stateService: StateService,
        protected uiRouter: UIRouterGlobals,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.config = Params.termsAcceptFormConfig(this.$params.requiredCheckbox);
        this.modal?.closed.then((status) => {
            if (status !== 'accept') {
                this.termsAcceptService.setModalTimeout();
                if (!this.termsAcceptService.checkState(this.uiRouter.current.name, this.uiRouter.current.params)) {
                    this.termsAcceptService.showDeniedNotify();
                    setTimeout(() => {
                        this.stateService.go('app.home');
                    }, 250);
                }
            }
        });
    }

    /**
     * Show modal with Terms and conditions
     */
    public showModal(): void {
        this.modalService.showModal('staticText', {slug: 'terms-and-conditions', parseAsPlainHTML: true});
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        try {
            form.disable();
            const data: IValidateData = form.getRawValue();
            await this.termsAcceptService.accept(data);
            if (this.modal) {
                this.modal.closeReason = 'accept';
                this.modal.closeModal(this.modal.$params.config.id);
            }
            return true;
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: gettext('Something went wrong. Please try again later.'),
                    wlcElement: 'notification_accept-error',
                },
            });
            return false;
        } finally {
            form.enable();
        }
    }
}
