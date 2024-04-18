import {
    AfterViewInit,
    ChangeDetectionStrategy,
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
 * TODO: пока что в компоненте не предусмотрена возмоность инжектирования
 * через wlc-wrapper, если понадобится - добавим.
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
    @Input('wlc-sa-params') public props?: unknown;
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

            this.componentRef = this.target.createComponent(m, {
                injector: this.injector,
            });

            this.status.emit({status: 'success', data: this.componentRef});
        } catch (error) {
            this.status.emit({status: 'error', data: error});
        }
    }

    protected createInjector(): void {
        if (this.props && !this.injector) {
            this.injector = Injector.create({
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: this.props,
                    },
                ],
                parent: this.hostInjector,
            });
        }
    }

    protected prepareParams(): void {
        if (this.injectParams?.saName) {
            this.name = this.injectParams.saName;
            this.props = this.injectParams.saParams;
        }
    }

}
