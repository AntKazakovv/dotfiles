import {
    Component,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    distinctUntilChanged,
    filter,
    takeUntil,
} from 'rxjs/operators';
import _isUndefined from 'lodash-es/isUndefined';

import {
    AbstractComponent,
    ISelectCParams,
    ModalService,
    EventService,
} from 'wlc-engine/modules/core';
import {PepService} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.service';
import {IPepInfoCParams} from 'wlc-engine/modules/user/submodules/pep/components/pep-info/pep-info.params';
import {MODALS_LIST} from 'wlc-engine/standalone/core/components/modal';

import {defaultParams} from './pep-select.params';

@Component({
    selector: '[wlc-pep-select]',
    templateUrl: './pep-select.component.html',
    styleUrls: ['./styles/pep-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PepSelectComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams!: ISelectCParams;

    public override $params!: ISelectCParams;

    constructor(
        @Inject('injectParams') protected injectParams: ISelectCParams,
        protected modalService: ModalService,
        protected pepService: PepService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (!this.$params?.control) {
            this.$params.control = new UntypedFormControl(this.pepService.status);
        }

        this.eventService.subscribe({name: 'PEP_CANCEL'}, () => {
            this.$params.control.setValue('');
            this.cdr.detectChanges();
        }, this.$destroy);

        this.changeStatusOnControlChanges();
        this.changeControlValueOnStatusChanges();
    }

    protected async showInfoModal(): Promise<void> {
        const {config} = MODALS_LIST['pepInfo'];

        config.onModalHidden = async (): Promise<void> => {
            const shouldStatusBeCancelled = component.closeReason === '';

            if (shouldStatusBeCancelled) {
                await this.pepService.cancelStatus();
            }
        };

        const component = await this.modalService.showModal<IPepInfoCParams>(config, {
            pep: this.$params.control.value,
        });
    }

    protected changeStatusOnControlChanges(): void {
        this.$params.control.valueChanges
            .pipe(
                distinctUntilChanged(),
                filter((v) => {
                    const {status} = this.pepService;

                    if (_isUndefined(v)) {
                        this.$params.control.setValue('');
                        return false;
                    }

                    return (v !== '') && (v !== status);
                }),
                takeUntil(this.$destroy),
            )
            .subscribe(() => this.showInfoModal());
    }

    protected changeControlValueOnStatusChanges(): void {
        this.pepService.statusChanges$
            .pipe(
                distinctUntilChanged(),
                filter((status) => status !== null),
                takeUntil(this.$destroy),
            )
            .subscribe((status) => this.updateControl(status));
    }

    protected updateControl(value: boolean): void {
        const {control} = this.$params;

        control.setValue(value);

        if (this.$params.locked) {
            control.disable();
        }
    }
}
