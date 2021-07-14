import {
    AfterViewInit,
    Component,
    Injector,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Renderer2,
} from '@angular/core';

import {
    ModalDirective,
} from 'ngx-bootstrap/modal';

import {Deferred} from 'wlc-engine/modules/core';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {DeviceModel} from 'wlc-engine/modules/core/system/models/device.model';
import {
    IModalOptions,
    IModalBsOptions,
} from 'wlc-engine/modules/core/components/modal/modal.interface';
import {defaultParams} from 'wlc-engine/modules/core/components/modal/modal.params';
import _isString from 'lodash-es/isString';
import _assign from 'lodash-es/assign';

/**
 * A wrapper component for displaying the component in a modal window.
 * It is a wrapper with basic elements, such as:
 * - backdrop
 * - modal body
 * - modal header
 * - modal content
 * - modal buttons
 * It includes all the necessary functionality for managing a modal window: displaying, hiding, etc.
 *
 * It is called automatically from the ModalService during the calling of a modal window. No manual call required.
 *
 * @param {ModalDirective} modalRef Modal component from ngx bootstrap package
 * @param {IModalOptions} $params Component parameters
 * @param {Injector} inject Angular Injector class.
 * @param {IModalBsOptions} bsOptions Bootstrap modal config.
 */
@Component({
    selector: '[wlc-modal-window]',
    templateUrl: './modal.component.html',
    styleUrls: ['./styles/modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WlcModalComponent extends AbstractComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('modal') public modalRef: ModalDirective;
    @ViewChild(ModalDirective) modalDirect: ModalDirective;

    public $params: IModalOptions;
    public dialogClasses: string[] = [];
    public inject: Injector;
    public bsOptions: IModalBsOptions = {};

    protected $closed: Deferred<string> = new Deferred();

    @Input() protected inlineParams: IModalOptions;

    constructor(
        @Inject('injectParams') protected params: IModalOptions,
        protected eventService: EventService,
        protected injector: Injector,
        protected ConfigService: ConfigService,
        protected modalService: ModalService,
        protected element: ElementRef,
        protected renderer: Renderer2,
    ) {
        super(<IMixedParams<IModalOptions>>{
            injectParams: params,
            defaultParams: defaultParams,
        }, ConfigService);
    }

    /**
     * @param {Promise<string>} closed Promise object that resolves when the modal is closed.
     */
    public get closed(): Promise<string> {
        return this.$closed.promise;
    }

    /**
     * A method that sets the closed state of the modal. Does not close the window itself, it is only used to put
     * the Promise object $closed in the Resolve state.
     * @param {string} str Closed modal state.
     */
    public setClosed(str: string): void {
        this.$closed.resolve(str);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.applyConfig();
        this.setDeviceClass();
        this.$params.wlcElement = this.$params.config?.wlcElement || this.$params.wlcElement || 'wlc-modal';
    }

    public ngAfterViewInit(): void {
        this.modalDirect.show();
        this.initEventHandlers();
    }

    /**
     * Closes the modal window
     * @param {string} modal Modal ID
     */
    public confirm(modal: string): void {
        const {config} = this.$params;

        if (config.onConfirm) {
            config.onConfirm();
        }
        this.closeModal(modal);
    }

    /**
     * Closes the modal window
     * @param {string} modal Modal ID
     */
    public closeModal(modal: string): void {
        this.modalService.hideModal(modal);
    }

    /**
     * Sets the title of a modal window
     * @param {string} title Modal title
     */
    public setTitle(title: string): void {
        this.$params.config.modalTitle = title;
    }

    /**
     * Getting the type of a modal window
     */
    public getType(): string {
        if (this.$params.config.modalMessage && this.$params.config.component) {
            return 'message-and-component';
        } else if (this.$params.config.templateRef) {
            return 'templateRef';
        } else if (this.$params.config.modalMessage) {
            return 'message';
        } else if (this.$params.config.component) {
            return 'component';
        } else if (this.$params.config.html) {
            return 'html';
        }
    }

    /**
     * The method of returning (opening) the previous modal window, if several of them were subsequently opened
     * @param name
     */
    public goBack(name): void {
        this.modalService.showModal(name);
    }

    protected applyConfig(): void {
        if (_isString(this.$params.config.modalMessage)) {
            this.$params.config.modalMessage = [this.$params.config.modalMessage];
        }

        const {config} = this.$params;
        _assign(this.bsOptions, {
            show: config.show,
            keyboard: config.keyboard,
            backdrop: config.backdrop,
            focus: config.focus,
        });

        const modifiers: string[] = [];
        modifiers.push(config.id);

        if (config.modifier) {
            modifiers.push(config.modifier);
        }

        this.addModifiers(modifiers);

        if (config.size) {
            this.dialogClasses.push(`wlc-modal__dialog--${config.size}`);
        }

        if (config.centered) {
            this.dialogClasses.push('wlc-modal__dialog--centered');
        }

        if (config.scrollable) {
            this.dialogClasses.push('wlc-modal__dialog--scrollable');
        }

        if (config.component) {

            const params = {
                setTitle: this.setTitle.bind(this),
            };

            this.inject = config.injector || Injector.create({
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: _assign({}, params, config.componentParams || {}),
                    },
                ],
                parent: this.injector,
            });
        }

        if (this.$params.config.modalBg) {
            this.renderer.setStyle(this.element.nativeElement, 'background', this.$params.config.modalBg);
        }
    }

    protected eventHandler(type: string, callback: () => void) {
        this.eventService.emit({
            name: type,
            data: this.$params.config.id,
        });

        if (callback) {
            callback();
        }
    }

    protected initEventHandlers(): void {
        this.modalRef.onShow.subscribe(() => {
            this.eventHandler(this.modalService.events.MODAL_SHOW, this.$params.config.onModalShow);
        });

        this.modalRef.onShown.subscribe(() => {
            this.eventHandler(this.modalService.events.MODAL_SHOWN, this.$params.config.onModalShown);
        });

        this.modalRef.onHidden.subscribe(() => {
            this.$closed.resolve();
            this.eventHandler(this.modalService.events.MODAL_HIDDEN, this.$params.config.onModalHidden);
        });

        this.modalRef.onHide.subscribe(() => {
            this.eventHandler(this.modalService.events.MODAL_HIDE, this.$params.config.onModalHide);
        });
    }

    private setDeviceClass(): void {
        const deviceClass = [
            '',
            this.ConfigService.get<DeviceModel>('device')?.osName,
            this.ConfigService.get<DeviceModel>('device')?.browserName,
        ];
        this.$hostClass += deviceClass.join(' ');
    }
}
