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
} from '@angular/core';

import {
    ModalDirective,
} from 'ngx-bootstrap/modal';

import {
    EventService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, DeviceModel} from 'wlc-engine/modules/core';

import {
    IModalOptions,
    IModalBsOptions,
    defaultParams,
} from './index';

import {
    assign as _assign,
    isString as _isString,
} from 'lodash-es';

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

    @Input() protected inlineParams: IModalOptions;

    constructor(
        @Inject('injectParams') protected params: IModalOptions,
        protected eventService: EventService,
        protected injector: Injector,
        protected ConfigService: ConfigService,
        protected modalService: ModalService,
    ) {
        super(<IMixedParams<IModalOptions>>{
            injectParams: params,
            defaultParams: defaultParams,
        }, ConfigService);
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

    public confirm(modal: string): void {
        const {config} = this.$params;

        if (config.onConfirm) {
            config.onConfirm();
        }
        this.modalRef.hide();
        this.modalService.closeModal(modal);
    }

    public closeModal(modal: string): void {
        this.modalRef.hide();
        this.modalService.closeModal(modal);
    }

    public setTitle(title: string): void {
        this.$params.config.modalTitle = title;
    }

    public getType(): string {
        if (this.$params.config.modalMessage && this.$params.config.component) {
            return 'message-and-component';
        } else if (this.$params.config.templateRef) {
            return 'templateRef';
        } else if (this.$params.config.modalMessage) {
            return 'message';
        } else if (this.$params.config.component) {
            return 'component';
        }
        return;
    }

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

            this.inject = Injector.create({
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: _assign({}, params, config.componentParams || {}),
                    },
                ],
                parent: this.injector,
            });
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
            this.eventHandler('show.bs.modal', this.$params.config.onModalShow);
        });

        this.modalRef.onShown.subscribe(() => {
            this.eventHandler('shown.bs.modal', this.$params.config.onModalShown);
        });

        this.modalRef.onHidden.subscribe(() => {
            this.eventHandler('hidden.bs.modal', this.$params.config.onModalHidden);
        });

        this.modalRef.onHide.subscribe(() => {
            this.eventHandler('hide.bs.modal', this.$params.config.onModalHide);
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
