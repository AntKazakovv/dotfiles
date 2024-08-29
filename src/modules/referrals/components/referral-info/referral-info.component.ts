import {
    Component,
    ChangeDetectionStrategy,
    Inject,
    Input,
    inject,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {Observable} from 'rxjs';

import {
    AbstractComponent,
    IButtonCParams,
    IInputCParams,
    IModalConfig,
    ModalService,
} from 'wlc-engine/modules/core';
import {RefInfoModel} from 'wlc-engine/modules/referrals/system/models/ref-info.model';
import {
    IRefInfoController,
    RefInfoController,
} from '../../system/classes/referral-info.controller';
import {IReferralsListCParams} from '../referrals-list/referrals-list.params';

import * as Params from './referral-info.params';

@Component({
    selector: '[wlc-referral-info]',
    templateUrl: './referral-info.component.html',
    styleUrls: ['./styles/referral-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RefInfoController],
})

export class ReferralInfoComponent extends AbstractComponent {
    @Input() protected inlineParams: Params.IReferralInfoCParams;

    public override $params: Params.IReferralInfoCParams;
    public readonly translateParams: Params.IReferralInfoTranslations;

    private _controller: IRefInfoController = inject(RefInfoController);
    private _inputParams: IInputCParams = {
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
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});

        this.translateParams = {
            casinoName: this._controller.casinoName,
        };
    }

    public get refInfo$(): Observable<RefInfoModel> {
        return this._controller.refInfo$;
    }

    public get decorUrl(): string {
        return this.$params.decorUrl;
    }

    public get decorFallbackUrl(): string {
        return this.$params.decorFallbackUrl;
    }

    public get getComissionBtnParams(): IButtonCParams {
        return this.$params.getCommissionBtn;
    }

    public get refListInlineParams(): IReferralsListCParams {
        return {theme: this.$params.theme};
    }

    public getInputParams(refLink: string): IInputCParams {
        return {
            ...this._inputParams,
            control: new UntypedFormControl(refLink),
        };
    }

    public takeProfit(): void {
        this.modalService.showModal({
            ...this.$params.confirmModalParams as IModalConfig,
            onConfirm: () => this._controller.takeProfit(),
        });
    }
}
