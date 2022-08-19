import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    Optional,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
    StateService,
    UIRouterGlobals,
} from '@uirouter/core';

import {
    AbstractComponent,
    ModalService,
    ICheckboxCParams,
    WlcModalComponent,
    EventService,
    NotificationEvents,
    IPushMessageParams,
    ConfigService,
} from 'wlc-engine/modules/core';
import {TermsAcceptService} from 'wlc-engine/modules/user/system/services';

import * as Params from './terms-accept.params';

@Component({
    selector: '[wlc-terms-accept]',
    templateUrl: './terms-accept.component.html',
    styleUrls: ['./styles/terms-accept.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptTermsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITermsAcceptCParams;

    public $params: Params.ITermsAcceptCParams;
    public checkBoxParams: ICheckboxCParams = {
        name: 'agreedWithTermsAndConditions',
        checkboxType: 'legal-modal',
        textWithLink: {
            prefix: gettext('I agree with'),
            linkText: gettext('Terms and Conditions'),
            slug: 'terms-and-conditions',
        },
        control: new FormControl(),
        wlcElement: 'block_terms-checkbox',
        common: {
            customModifiers: 'terms',
        },
    };

    private loading: boolean = false;

    constructor(
        @Inject('injectParams')
        protected injectParams: Params.ITermsAcceptCParams,
        @Optional() @Inject(WlcModalComponent)
        protected modal: WlcModalComponent,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected termsAcceptService: TermsAcceptService,
        protected stateService: StateService,
        protected uiRouter: UIRouterGlobals,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.modal?.closed.then((status) => {
            if (status !== 'accept') {
                this.termsAcceptService.setModalTimeout();

                if (this.$params.source === 'userinfo'
                    && !this.termsAcceptService.checkState(this.uiRouter.current.name, this.uiRouter.current.params)) {
                    this.stateService.go('app.home');
                    this.termsAcceptService.showDeniedNotify();
                }
            }
        });
    }

    /**
     * If the checkbox is checked, the button text is "Ok", otherwise it's "Close"
     * @returns {string} 'Ok' or 'Close'
     */
    public get buttonText(): string {
        return this.checkBoxParams.control.value ? gettext('Ok') : gettext('Close');
    }

    /**
     * Show modal with Terms and conditions
     */
    public showModal(): void {
        this.modalService.showModal('staticText', {slug: 'terms-and-conditions', parseAsPlainHTML: true});
    }

    /**
     * Process click Ok button (accept or not T&C)
     *
     * @returns {Promise<void>}
     */
    public async accept(): Promise<void> {
        if (this.loading) {
            return;
        }

        if (this.checkBoxParams.control.value) {
            try {
                this.loading = true;
                await this.termsAcceptService.accept();
                if (this.modal) {
                    this.modal.closeReason = 'accept';
                    this.modal.closeModal(this.modal.$params.config.id);
                }
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
            } finally {
                this.loading = false;
            }
        } else {
            if (this.modal) {
                this.modal.closeModal(this.modal.$params.config.id);
            }
        }
    }
}
