import {
    ApplicationRef,
    Injectable,
    Injector,
    ComponentFactoryResolver,
    Inject,
    RendererFactory2,
    ComponentRef,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

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
} from 'wlc-engine/modules/core/services';

import {
    assignIn as _assignIn,
    isString as _isString,
    find as _find,
    remove as _remove,
    forEach as _forEach,
} from 'lodash';

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
    protected modalParams: IModalOptions = this.configService.get('appConfig.siteconfig.modalParams') || {};

    constructor(
        protected appRef: ApplicationRef,
        protected cfr: ComponentFactoryResolver,
        protected renderer: RendererFactory2,
        protected eventService: EventService,
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected configService: ConfigService,
        protected logService: LogService,
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
    public showModal(config: IModalParams): ComponentRef<WlcModalComponent> {
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

        if (!modalConfig.id) {
            this.logService.sendLog({
                code: '0.3.1',
                data: {
                    modalConfig: modalConfig,
                },
            });
            return;
        }

        return this.open(modalConfig);
    }

    /**
     * Show error modal with params.
     *
     * @param config if string, search by id on MODALS_LIST.
     * @returns Reference on component
     */
    public showError(config: Partial<IModalConfig>): ComponentRef<WlcModalComponent> {
        return this.showModal(_assignIn({
            id: 'Error',
            modalTitle: gettext('Error'),
        }, config));
    }

    /**
     * Close modal by Id
     *
     * @param id modal identifier
     * @returns void
     */
    public closeModal(id: string): void {
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

        modal.ref.instance.modalDirect.hide();
    }

    /**
     * Close all active modals
     */
    public closeAllModals(): void {
        _forEach(this.activeModals, (item: IActiveModal) => {
            this.closeModal(item.id);
        });
    }

    /**
     * Init listeners of modal events
     */
    protected initListeners(): void {
        this.eventService.subscribe(
            {name: this.events.MODAL_HIDDEN},
            (id: string) => this.remove(id),
        );

        this.eventService.subscribe(
            {name: 'SHOW_MODAL'},
            (modalName: string) => {
                this.showModal(modalName);
            },
        );

        this.eventService.subscribe(
            {name: 'CLOSE_MODAL'},
            (modalName: string) => {
                this.closeModal(modalName);
            },
        );
    }

    /**
     * Remode modal instance from DOM by id
     *
     * @param id modal identifier
     */
    protected remove(id: string): void {
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
    }

    /**
     * Create modal instance and render component
     *
     * @param config modal window configuration
     * @returns Reference on component
     */
    protected open(config: IModalConfig): ComponentRef<WlcModalComponent> {
        if (config.dismissAll) {
            this.closeAllModals();
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
        let windowCmptRef = windowFactory.create(injector);
        this.appRef.attachView(windowCmptRef.hostView);
        this.document.body.appendChild(windowCmptRef.location.nativeElement);

        this.activeModals.push({
            id: config.id,
            ref: windowCmptRef,
        });

        return windowCmptRef;
    }
}
