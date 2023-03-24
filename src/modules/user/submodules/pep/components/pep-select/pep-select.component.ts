import {
    Component,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {
    distinctUntilChanged,
    filter,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ISelectCParams,
    ModalService,
    MODALS_LIST,
    EventService,
} from 'wlc-engine/modules/core';
import {PepService} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.service';
import {IPepInfoCParams} from 'wlc-engine/modules/user/submodules/pep/components/pep-info/pep-info.params';

import {defaultParams} from './pep-select.params';

@Component({
    selector: '[wlc-pep-select]',
    templateUrl: './pep-select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PepSelectComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams!: ISelectCParams;

    public $params!: ISelectCParams;

    constructor(
        @Inject('injectParams') protected injectParams: ISelectCParams,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected pepService: PepService,
        protected eventService: EventService,
    ) {
        super({
            injectParams,
            defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (!this.$params?.control) {
            this.$params.control = new FormControl(this.pepService.status);
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

        config.onModalHidden = async () => {
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
