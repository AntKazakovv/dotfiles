import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
} from '@angular/core';

import {
    BehaviorSubject,
} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {
    AbstractComponent,
    ConfigService,
    DataService,
    ModalService,
    EventService,
} from 'wlc-engine/modules/core';
import {TLevel} from 'wlc-engine/modules/core/components/alert/alert.params';
import {
    ShuftiProKycamlService,
} from 'wlc-engine/modules/aml/system/services/shufti-pro-kycaml/shufti-pro-kycaml.service';
import {questionnaireStatus} from 'wlc-engine/modules/aml/system/interfaces/kyc-aml.interface';
import {questionnaireStatusText} from 'wlc-engine/modules/aml/system/constants/kyc-aml.constants';

import * as Params from './kyc-questionnaire-info.params';

@Component({
    selector: '[wlc-kyc-questionnaire-info]',
    templateUrl: './kyc-questionnaire-info.component.html',
    styleUrls: ['./styles/kyc-questionnaire-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class KycQuestionnaireInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IKycQuestionnaireInfoCParams;

    public override $params: Params.IKycQuestionnaireInfoCParams;
    public state$: BehaviorSubject<Params.IKYCQState> = new BehaviorSubject(null);
    public ready: boolean = false;
    public infoLevel: TLevel = 'info';
    public awaitingStatusText: string = this.translateService.instant(questionnaireStatusText['AwaitingValidation']);
    protected sumDeposits: number = 0;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IKycQuestionnaireInfoCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected dataService: DataService,
        protected eventService: EventService,
        protected translateService: TranslateService,
        protected shuftyProKycamlService: ShuftiProKycamlService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.sumDeposits = await this.getSumDeposits();
        this.eventService.subscribe({name: 'KYC_FORM_SEND'}, () => {
            this.applyAwaiting();
        });

        this.docStatusHandler();
    }

    public fillFormHandler(): void {
        this.modalService.showModal({
            id: 'kyc-questionnaire',
            componentName: 'aml.wlc-kyc-questionnaire',
            showFooter: false,
            closeBtnVisibility: false,
            backdrop: 'static',
        });
    }

    protected async getSumDeposits(): Promise<number> {
        return await this.shuftyProKycamlService.sumDeposits();
    }

    protected applyAwaiting(): void {
        this.state$.next({
            showInfo: false,
            showBtn: false,
            showStatus: false,
            awaitingStatus: true,
        });
    }

    protected get infoTextByDep(): string {
        return this.sumDeposits >= 2000 ?
            this.translateService.instant(gettext('The total amount of your deposits is equal ' +
                'to or exceeds 2000 euros. The operator will not be able to confirm your deposit, ' +
                'as your KYC questionnaire is not filled out. Please fill out the KYC questionnaire')) :
            this.translateService.instant(gettext('In accordance of our AML measures, ' +
                'we are obliged to collect some information about users.' +
                ' Please kindly answer the questions and confirm the information provided'));
    }

    protected async docStatusHandler(): Promise<void> {
        const docs = await this.shuftyProKycamlService.getDocs('kycMode');
        const latestDocStatus: questionnaireStatus = docs.data[0]?.Status === 'Expired' ?
            'FailedValidation' : docs.data[0]?.Status;
        const statusText = docs.data.length ?
            this.translateService.instant(questionnaireStatusText[latestDocStatus]) :
            this.translateService.instant(gettext('KYC questionnaire is not filled out'));

        switch (latestDocStatus) {
            case 'AwaitingValidation':
                this.applyAwaiting();
                break;
            case 'FailedValidation':
                this.state$.next({
                    infoText: this.infoTextByDep,
                    statusText: statusText,
                    statusLevel: 'error',
                    showInfo: true,
                    showStatus: true,
                    showBtn: true,
                });
                break;
            case 'Validated':
                this.state$.next({
                    infoText: this.infoTextByDep,
                    statusLevel: 'success',
                    statusText: statusText,
                    showStatus: true,
                    showInfo: false,
                    showBtn: false,
                });
                break;
            default:
                this.state$.next({
                    infoText: this.infoTextByDep,
                    statusText: statusText,
                    statusLevel: 'warning',
                    showInfo: true,
                    showStatus: true,
                    showBtn: true,
                });
                break;
        }
        this.ready = true;
        this.cdr.markForCheck();
    }
}
