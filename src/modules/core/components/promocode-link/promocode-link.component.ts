import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import _set from 'lodash-es/set';

import {
    IButtonCParams,
    IInputCParams,
    ILinkBlockCParams,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

import * as Params from './promocode-link.params';

@Component({
    selector: '[wlc-promocode-link]',
    templateUrl: './promocode-link.component.html',
    styleUrls: ['./styles/promocode-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PromocodeLinkComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IPromoCodeLinkCParams;
    public override $params: Params.IPromoCodeLinkCParams;

    protected showPromoCode: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPromoCodeLinkCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.provideParams();
    }

    public get registrationPromoCode(): IInputCParams {
        return this.$params.registrationPromoCode;
    }

    public get inputBtnParams(): IButtonCParams {
        return this.$params.inputBtnParams;
    }

    public get linkBlockParams(): ILinkBlockCParams {
        return this.$params.linkPromoCode;
    }

    public get onSubmit(): Function | undefined {
        return this.$params.onSubmit;
    }

    @CustomHook({module: 'core', class: 'PromocodeLinkComponent', method: 'provideParams'})
    protected provideParams(): void {
        const index = this.$params.validatorsField.findIndex((el) => el.name === 'registrationPromoCode');
        _set(this.$params, 'registrationPromoCode.validators', this.$params.validatorsField[index].validators);
        _set(this.$params, 'linkPromoCode.common.actionParams.callback', () => this.setShowPromoCode());
    }

    protected setShowPromoCode(): void {
        this.showPromoCode = true;
        this.cdr.markForCheck();
    }
}
