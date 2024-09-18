import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    EventEmitter,
    Inject,
    Injector,
    Input,
    Optional,
    Output,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {TStandaloneName} from 'wlc-engine/modules/core/system/constants/modules.constants';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export type TSaStatus = {status: 'success', data: ComponentRef<unknown>}
    | {status: 'error', data: 'error'}

export interface ISaCParams<T> {
    saName: TStandaloneName,
    saParams?: T,
}
/**
 * Standalone simple wrapper component.
 * Implements providing standalone components via Injection service.
 *
 * @example
 * ```
 * <div wlc-sa="my-standalone-component" class="{{$class}}__wrapper"></div>
 * ```
 */

@Component({
    selector: '[wlc-sa]',
    templateUrl: './sa.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaComponent implements AfterViewInit {
    @ViewChild('target', {read: ViewContainerRef, static: true})
    protected target: ViewContainerRef;

    /**
     * Standalone component name defined in `modules.constants`
     */
    @Input('wlc-sa') public name!: TStandaloneName;
    /**
     * Standalone component params. If defined, will be injected as `injectParams`
     * to the component. Will be provided only if `wlc-sa-injector` is undefined.
     */
    @Input('wlc-sa-input-params') public inputParams?: IIndexing<unknown>;
    /**
     * Standalone component injector. If defined, will be provided to component.
     * `wlc-sa-params` will be ignored.
     */
    @Input('wlc-sa-injector') public injector?: Injector;

    @Output() public readonly status = new EventEmitter<TSaStatus>();

    protected componentRef!: ComponentRef<unknown>;

    constructor(
        @Optional()
        @Inject('injectParams') protected injectParams: ISaCParams<unknown>,
        protected injectionService: InjectionService,
        protected hostInjector: Injector,
        protected cdr: ChangeDetectorRef,
    ) {}

    public ngAfterViewInit(): void {
        this.prepareParams();
        this.createInjector();
        this.initComponent();
    }

    protected async initComponent(): Promise<void> {
        try {
            if (!this.name) {
                throw Error('Name is empty');
            }

            const m: Type<unknown> = await this.injectionService
                .loadStandalone(this.name);

            const componentRef = this.target.createComponent(m, {
                injector: this.injector,
            });

            if (this.inputParams) {
                for (let key in this.inputParams) {
                    componentRef.setInput(key, this.inputParams[key]);
                }
            }

            this.componentRef = componentRef;

            this.cdr.markForCheck();

            this.status.emit({status: 'success', data: this.componentRef});
        } catch (error) {
            this.status.emit({status: 'error', data: error});
        }
    }

    protected createInjector(): void {
        if (this.injectParams && !this.injector) {
            this.injector = Injector.create({
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: this.injectParams.saParams,
                    },
                ],
                parent: this.hostInjector,
            });
        }
    }

    protected prepareParams(): void {
        if (this.injectParams?.saName && !this.name) {
            this.name = this.injectParams.saName;
        }
    }
}
