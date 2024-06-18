import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ViewChild,
    TemplateRef,
    ElementRef,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    AbstractComponent,
    IInputCParams,
    ModalService,
} from 'wlc-engine/modules/core';

import {
    takeUntil,
} from 'rxjs';
import _merge from 'lodash-es/merge';

import {RefInfoModel} from 'wlc-engine/modules/referrals/system/models/ref-info.model';
import {ReferralsService} from 'wlc-engine/modules/referrals/system/services/referrals.service';

import * as Params from './referral-info.params';

@Component({
    selector: '[wlc-referral-info]',
    templateUrl: './referral-info.component.html',
    styleUrls: ['./styles/referral-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ReferralInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IReferralInfoCParams;
    @ViewChild('confirmationTpl') public confirmationTpl: TemplateRef<ElementRef>;
    public override $params: Params.IReferralInfoCParams;
    public refInfo: RefInfoModel;
    public translateParams: Params.IReferralInfoTranslations;
    public inputParams: IInputCParams = {
        name: 'link',
        theme: 'vertical',
        common: {
            separateLabel: gettext('Referral link'),
            readonly: true,
            placeholder: '',
            customModifiers: 'right-shift',
        },
        clipboard: true,
        control: null,
    };

    constructor(
        @Inject('injectParams') protected injectParams: Params.IReferralInfoCParams,
        protected referralsService: ReferralsService,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        await this.configService.ready;

        this.translateParams = {
            casinoName: this.configService.get<string>('$base.site.name') ?? '',
        };

        this.referralsService.refInfo$.pipe(takeUntil(this.$destroy)).subscribe((data: RefInfoModel) => {
            if (data) {
                this.refInfo = data;
                const refLink: string = `${this.configService.get<string>('appConfig.site')}?${data.link}`;
                this.inputParams.control = new UntypedFormControl(refLink);
                this.cdr.markForCheck();
            }
        });
        this.referralsService.getRefInfo();
    }

    public get decorUrl(): string {
        return this.$params.decorUrl;
    }

    public get decorFallbackUrl(): string {
        return this.$params.decorFallbackUrl;
    }

    public takeProfit(): void {
        this.modalService.showModal(
            _merge(this.$params.confirmModalParams, {
                onConfirm: () => this.referralsService.takeProfit(),
            }),
        );
    }
}
