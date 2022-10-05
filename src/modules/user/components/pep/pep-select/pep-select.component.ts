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

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';


import {IPepInfoCParams} from 'wlc-engine/modules/user/components/pep/pep-info/pep-info.params';
import {PepService} from 'wlc-engine/modules/user/system/services/pep/pep.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {MODALS_LIST} from 'wlc-engine/modules/core/components/modal/modal.params';
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

                    return (status !== null) && (v !== status);
                }),
                takeUntil(this.$destroy),
            )
            .subscribe(() => this.showInfoModal());
    }

    protected changeControlValueOnStatusChanges(): void {
        this.pepService.statusChanges$
            .pipe(
                filter((status) => (
                    this.$params.control.value !== status
                )),
                takeUntil(this.$destroy),
            )
            .subscribe((status) => {
                this.$params.control.setValue(status, {emitEvent: false});
                this.cdr.markForCheck();
            });

        this.pepService.statusChanges$
            .pipe(
                distinctUntilChanged(),
                filter((status) => (
                    (status !== null) && (this.$params.control.value !== status)
                )),
                takeUntil(this.$destroy))
            .subscribe((pep) => this.updateControl(pep));
    }

    protected updateControl(value: string): void {
        const {control} = this.$params;

        control.setValue(value);

        if (value && this.$params.locked) {
            control.disable();
        }
    }
}
