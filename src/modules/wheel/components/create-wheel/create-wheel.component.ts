import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    IFormWrapperCParams,
    IIndexing,
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
    public configForm!: IFormWrapperCParams;
    public formData$: BehaviorSubject<IIndexing<any>> = new BehaviorSubject(null);

    constructor(
        @Inject('injectParams') protected params: Params.ICreateWheelCParams,
        configService: ConfigService,
        protected wheelService: WheelService,
    ) {
        super(<IMixedParams<Params.ICreateWheelCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.configForm = Params.formConfig;
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const settingsWheel: ISettingsWheel = {
            amount: form.value.amount,
            duration: form.value.duration,
            winnersCount: form.value.winners,
        };

        try {
            form.disable();
            this.wheelService.createWheel(settingsWheel);
            return true;
        } catch (error) {
            return false;
        } finally {
            form.enable();
        }
    }
}
