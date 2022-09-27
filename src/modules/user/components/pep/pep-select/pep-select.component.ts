import {
    Component,
    ChangeDetectorRef,
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
} from 'wlc-engine/modules/core';
import {PepService} from 'wlc-engine/modules/user/system/services/pep/pep.service';
import {IPepInfoCParams} from '../pep-info/pep-info.params';

import {defaultParams} from './pep-select.params';


@Component({
    selector: '[wlc-pep-select]',
    templateUrl: './pep-select.component.html',
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
        await this.modalService.showModal<IPepInfoCParams>('pepInfo', {
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
