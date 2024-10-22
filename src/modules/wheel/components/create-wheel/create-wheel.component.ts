import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
} from '@angular/core';
import {
    UntypedFormControl,
    UntypedFormGroup,
} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    IMixedParams,
    IFormWrapperCParams,
    IIndexing,
    IFormComponent,
    ICheckboxCParams,
} from 'wlc-engine/modules/core';
import {WheelService} from 'wlc-engine/modules/wheel/system/services/wheel.service';

import {ISettingsWheel} from 'wlc-engine/modules/wheel/system/interfaces/wheel.interface';

import * as Params from './create-wheel.params';

@Component({
    selector: '[wlc-create-wheel]',
    templateUrl: './create-wheel.component.html',
    styleUrls: ['./styles/create-wheel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWheelComponent extends AbstractComponent implements OnInit {
    public override $params!: Params.ICreateWheelCParams;
    protected configForm: IFormWrapperCParams | null = null;
    protected formData$: BehaviorSubject<IIndexing<any>> = new BehaviorSubject(null);
    protected affilate: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.ICreateWheelCParams,
        protected wheelService: WheelService,
    ) {
        super(<IMixedParams<Params.ICreateWheelCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.prepareForm();
    }

    public prepareForm(): void {
        const formConfig = _cloneDeep(Params.formConfig);

        if (this.wheelService.getUserWheel().isAffUser) {
            const onlyForRefCheckbox: IFormComponent = {
                name: 'core.wlc-checkbox',
                alwaysNew: {
                    saveValue: true,
                },
                params: <ICheckboxCParams>{
                    name: 'onlyRef',
                    text: gettext('Raffle for referrals'),
                    textSide: 'right',
                    control: new UntypedFormControl(),
                    onChange: (checked: boolean) => {
                        this.affilate = checked;
                    },
                },
            };
            formConfig.components.splice(formConfig.components.length - 1, 0, onlyForRefCheckbox);
        }
        this.configForm = formConfig;
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const settingsWheel: ISettingsWheel = {
            amount: form.value.amount,
            duration: form.value.duration,
            winnersCount: form.value.winners,
            onlyForReferrals: this.affilate,
        };

        try {
            form.disable();
            await this.wheelService.createWheel(settingsWheel);
            return true;
        } catch (error) {
            return false;
        } finally {
            form.enable();
        }
    }
}
