import {
    ApplicationRef,
    ComponentFactoryResolver,
    Injectable,
    Injector,
    Inject,
    ComponentRef,
    Type,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
    BsModalService,
} from 'ngx-bootstrap/modal';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {MODALS_LIST, DEFAULT_MODAL_CONFIG} from 'wlc-engine/modules/core/components/modal/modal.params';
import {WlcModalComponent} from 'wlc-engine/modules/core/components/modal/modal.component';
import {IModalList} from 'wlc-engine/modules/core/components/modal/modal.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {
    IModalConfig,
    IModalOptions,
    IModalEvents,
    IActiveModal,
    IModalName,
} from 'wlc-engine/modules/core/components/modal/modal.interface';

import _assignIn from 'lodash-es/assignIn';
import _isString from 'lodash-es/isString';
import _find from 'lodash-es/find';
import _map from 'lodash-es/map';
import _filter from 'lodash-es/filter';
import _remove from 'lodash-es/remove';
import _forEach from 'lodash-es/forEach';
import _get from 'lodash-es/get';

export type IModalParams = IModalConfig | IModalName;

@Injectable({providedIn: 'root'})
export class ModalService {

    public events: IModalEvents = {
        MODAL_SHOW: 'show.bs.modal',
        MODAL_SHOWN: 'shown.bs.modal',
        MODAL_HIDE: 'hide.bs.modal',
        MODAL_HIDDEN: 'hidden.bs.modal',
        MODAL_HIDE_PREVENTED: 'hidePrevented.bs.modal',
    };

    protected modalList: IModalList = MODALS_LIST;
    protected activeModals: IActiveModal[] = [];
    protected closeQueue: string[] = [];
    protected $closeObserver: BehaviorSubject<number> = new BehaviorSubject(0);
    protected readonly modalParams: IModalOptions = this.configService.get('$modals.modalParams') || {};

    constructor(
        protected appRef: ApplicationRef,
        protected cfr: ComponentFactoryResolver,
        protected eventService: EventService,
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected configService: ConfigService,
        protected logService: LogService,
        protected BsModalService: BsModalService,
        private injectionService: InjectionService,
    ) {
        this.initListeners();
        this.mergeModalConfig();
    }

    /**
     * Get active modal instance by id
     *
     * @param id identifier of modal window
     * @returns modal instance
     */
    public getActiveModal(id: string): IActiveModal {
        return _find(this.activeModals, (item: IActiveModal) => item.id === id);
    }

    /**
     * Show modal with params.
     *
     * @param config if string, search by id on MODALS_LIST.
     * @param componentParams
     * @returns Reference on component
     */
    public async showModal<T>(config: IModalParams, componentParams?: T): Promise<WlcModalComponent> {
        let modalConfig: IModalConfig;

        if (_isString(config)) {
            if (config === 'signup' && this.configService.get<boolean>('$base.site.restrictRegistration')) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        message: gettext('Sorry, registration is disabled.'),
                        wlcElement: 'registration-is-disabled',
                    },
                });
                return;
            }

            if (this.modalList[config]) {
                modalConfig = _assignIn(
                    {},
                    DEFAULT_MODAL_CONFIG,
                    this.modalList[config].config);
            } else {
                this.logService.sendLog({
                    code: '0.3.2',
                    data: {id: config},
                    flog: {id: config},
                });
                return;
            }
        } else {
            modalConfig = _assignIn({}, DEFAULT_MODAL_CONFIG, config);
        }

        if (!modalConfig.id) {
            this.logService.sendLog({
                code: '0.3.1',
                data: {config: modalConfig},
            });
            return;
        }

        if (modalConfig.componentName) {
            const component = await this.injectionService.loadComponent(modalConfig.componentName);
            if (component) {
                modalConfig.component = component as Type<unknown>;
            }
        }

        if (componentParams) {
            modalConfig.componentParams = componentParams;
        }
        if (modalConfig.dismissAll && this.activeModals.length) {
            this.closeAllModals();
        }

        if (this.closeQueue.length) {
            const $watcher = new Subject();
            this.$closeObserver.pipe(takeUntil($watcher)).subscribe((val: number) => {
                if (!val) {
                    $watcher.next();
                    $watcher.complete();
                    this.openModal(modalConfig);
                }
            });
            return;
        }

        return this.openModal(modalConfig);
    }

    /**
     * Show error modal with params.
     *
     * @param config if string, search by id on modalList.
     * @returns Reference on component
     */
    public showError(config: Partial<IModalConfig>): void {
        this.showModal(_assignIn({
            id: 'Error',
            modalTitle: gettext('Error'),
            size: 'md',
        }, config));
    }

    /**
     * Close modal by Id
     *
     * @param id modal identifier
     * @returns void
     */
    public hideModal(id: string): void {
        const modals: IActiveModal[] = _filter(this.activeModals, (item: IActiveModal) => item.id === id);

        if (!modals.length) {
            this.logService.sendLog({
                code: '0.3.3',
                data: {id},
                flog: {id, method: 'hide'},
            });
            return;
        }

        this.closeQueue.push(..._map(modals, ({id}) => id));
        this.$closeObserver.next(this.closeQueue.length);
        _forEach(modals, (modal) => {
            modal.ref.instance.modalDirect.hide();
        });
    }

    /**
     * Close all active modals
     */
    public closeAllModals(): void {
        _forEach(this.activeModals, (item: IActiveModal) => {
            this.hideModal(item.id);
        });
    }

    /**
     * Init listeners of modal events
     */
    private initListeners(): void {
        this.eventService.subscribe(
            {name: this.events.MODAL_HIDDEN},
            (id: string) => {
                this.closeModal(id);
            },
        );

        this.eventService.subscribe(
            {name: 'SHOW_MODAL'},
            (modalId: string) => {
                this.showModal(modalId);
            },
        );

        this.eventService.subscribe(
            {name: 'CLOSE_MODAL'},
            (modalId: string) => {
                this.hideModal(modalId);
            },
        );

        this.$closeObserver.subscribe((val: number) => {
            // fix nested modals
            if (!val) {
                if (!this.activeModals.length) {
                    if (this.document.body.classList.contains('modal-open')) {
                        this.BsModalService.removeBackdrop();
                    }
                } else {
                    if (!this.document.body.classList.contains('modal-open')) {
                        this.document.body.classList.add('modal-open');
                        this.BsModalService.setScrollbar();
                    }
                }
            }
        });
    }

    /**
     * Remove modal instance from DOM by id
     *
     * @param id modal identifier
     */
    private closeModal(id: string): void {
        const modal: IActiveModal = _find(this.activeModals, (item: IActiveModal) => item.id === id);

        if (!modal) {
            this.logService.sendLog({
                code: '0.3.3',
                data: {id},
                flog: {id, method: 'close'},
            });
            return;
        }

        this.appRef.detachView(modal.ref.hostView);
        modal.ref.destroy();

        _remove(this.activeModals, (item: IActiveModal) => item.id === id);

        const lastModal = this.activeModals[this.activeModals.length - 1];
        if (lastModal) {
            lastModal.ref.location.nativeElement.children[0].focus();
        }

        _remove(this.closeQueue, (item: string) => item === id);
        this.$closeObserver.next(this.closeQueue.length);
    }

    private openModal(config: IModalConfig): WlcModalComponent {
        if (_find(this.activeModals, ({id}) => id === config.id)) {
            return;
        }

        let windowFactory = this.cfr.resolveComponentFactory(WlcModalComponent);
        let injector = Injector.create({
            providers: [
                {
                    provide: 'injectParams',
                    useValue: {...this.modalParams, config: config},
                },
            ],
        });

        const windowCmptRef: ComponentRef<WlcModalComponent> = windowFactory.create(injector);
        const modalElement = windowCmptRef.location.nativeElement;

        this.appRef.attachView(windowCmptRef.hostView);
        this.document.body.appendChild(modalElement);

        this.activeModals.push({
            id: config.id,
            ref: windowCmptRef,
        });

        setTimeout(() => {
            const backDropElement = _get(windowCmptRef, 'instance.modalRef.backdrop.location.nativeElement');
            if (backDropElement) {
                const currentZIndex = +globalThis?.getComputedStyle(modalElement).zIndex;
                modalElement.style.zIndex = currentZIndex + this.activeModals.length * 10;
                backDropElement.style.zIndex = +modalElement.style.zIndex - 1;
            }
        });
        return windowCmptRef.instance;
    }

    /**
     * Add custom modals via project's settings. Use '$modals' constant
     * in frontend config, same as $base, $modules and etc;
     */
    private async mergeModalConfig(): Promise<void> {
        await this.configService.ready;
        this.modalList = GlobalHelper
            .mergeConfig(this.modalList, this.configService.get<IModalList>('$modals.customModals'));
    }
}
