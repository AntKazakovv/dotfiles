import {
    ApplicationRef,
    ComponentFactoryResolver,
    Injectable,
    Injector,
    Inject,
    RendererFactory2,
    ComponentRef,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
    BsModalService,
} from 'ngx-bootstrap/modal';

import {
    IModalConfig,
    IModalOptions,
    IModalEvents,
    IActiveModal,
    IModalName,
    MODALS_LIST,
    DEFAULT_MODAL_CONFIG,
    WlcModalComponent,
} from 'wlc-engine/modules/core/components/modal';
import {
    EventService,
    ConfigService,
    LogService,
} from 'wlc-engine/modules/core/system/services';

import {
    assignIn as _assignIn,
    isString as _isString,
    find as _find,
    remove as _remove,
    forEach as _forEach,
    get as _get,
} from 'lodash-es';

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

    protected activeModals: IActiveModal[] = [];
    protected closeQueue: string[] = [];
    protected $closeObserver: BehaviorSubject<number> = new BehaviorSubject(0);
    protected modalParams: IModalOptions = this.configService.get('appConfig.siteconfig.modalParams') || {};

    constructor(
        protected appRef: ApplicationRef,
        protected cfr: ComponentFactoryResolver,
        protected renderer: RendererFactory2,
        protected eventService: EventService,
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected configService: ConfigService,
        protected logService: LogService,
        protected BsModalService: BsModalService,
    ) {
        this.initListeners();
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
     * @returns Reference on component
     */
    public showModal<T>(config: IModalParams, componentParams?: T): void {
        let modalConfig: IModalConfig;

        if (_isString(config)) {
            if (MODALS_LIST[config]) {
                modalConfig = _assignIn({}, DEFAULT_MODAL_CONFIG, MODALS_LIST[config].config);
            } else {
                this.logService.sendLog({
                    code: '0.3.0',
                    data: {
                        modalConfig: config,
                    },
                });
                return;
            }
        } else {
            modalConfig = _assignIn({}, DEFAULT_MODAL_CONFIG, config);
        }

        if (componentParams) {
            modalConfig.componentParams = componentParams;
        }

        if (!modalConfig.id) {
            this.logService.sendLog({
                code: '0.3.1',
                data: {
                    modalConfig: modalConfig,
                },
            });
            return;
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

        this.openModal(modalConfig);
    }

    /**
     * Show error modal with params.
     *
     * @param config if string, search by id on MODALS_LIST.
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
        const modal: IActiveModal = _find(this.activeModals, (item: IActiveModal) => item.id === id);

        if (!modal) {
            this.logService.sendLog({
                code: '0.3.0',
                data: {
                    modalId: id,
                },
            });
            return;
        }

        this.closeQueue.push(modal.id);
        this.$closeObserver.next(this.closeQueue.length);
        modal.ref.instance.modalDirect.hide();
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
                    if (document.body.classList.contains('modal-open')) {
                        this.BsModalService.removeBackdrop();
                    }
                } else {
                    if (!document.body.classList.contains('modal-open')) {
                        document.body.classList.add('modal-open');
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
                code: '0.3.0',
                data: {
                    modalId: id,
                },
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

    private openModal(config: IModalConfig): void {
        let windowFactory = this.cfr.resolveComponentFactory(WlcModalComponent);
        let injector = Injector.create({
            providers: [
                {
                    provide: 'injectParams',
                    useValue: {...this.modalParams, config: config},
                },
            ],
        });

        let windowCmptRef: ComponentRef<any> = windowFactory.create(injector);
        const modalElement = windowCmptRef.location.nativeElement;

        this.appRef.attachView(windowCmptRef.hostView);
        this.document.body.appendChild(modalElement);

        setTimeout(() => {
            const backDropElement = _get(windowCmptRef, 'instance.modalRef.backdrop.location.nativeElement');
            if (backDropElement) {
                const currentZIndex = +globalThis?.getComputedStyle(modalElement).zIndex;
                modalElement.style.zIndex = currentZIndex + this.activeModals.length * 10;
                backDropElement.style.zIndex = +modalElement.style.zIndex - 1;
            }

            this.activeModals.push({
                id: config.id,
                ref: windowCmptRef,
            });
        });
    }
}
