import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    ElementRef,
    OnDestroy,
    Injector,
    Inject,
    HostListener,
    Input,
    ViewChild,
} from '@angular/core';
import {
    BsModalRef,
    BsModalService,
    ModalDirective,
} from 'ngx-bootstrap/modal';

import {
    IModalOptions,
    IModalBsOptions,
    defaultParams,
} from './index';
import {EventService} from 'wlc-engine/modules/core/system/services';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';

import {
    assign as _assign,
} from 'lodash';

@Component({
    selector: '[wlc-modal-window]',
    templateUrl: './modal.component.html',
    styleUrls: ['./styles/modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WlcModalComponent extends AbstractComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('modal') public modalRef: BsModalRef;
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
        protected modalService: BsModalService,
    ) {
        super(<IMixedParams<IModalOptions>>{
            injectParams: params,
            defaultParams: defaultParams,
        }, ConfigService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.applyConfig();
    }

    public ngAfterViewInit(): void {
        this.modalDirect.show();
    }


    public confirm(): void {
        const {config} = this.$params;

        if (config.onConfirm) {
            config.onConfirm();
        }

        this.modalRef.hide();
    }

    public setTitle(title: string): void {
        this.$params.config.modalTitle = title;
    }

    protected applyConfig(): void {
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

    @HostListener('show.bs.modal', ['$event.type', 'this.$params.config.onModalShow'])
    protected showHandler(type: string, callback: () => void): void {
        this.eventHandler(type, callback);
    };

    @HostListener('shown.bs.modal', ['$event.type', 'this.$params.config.onModalShown'])
    protected shownHandler(type: string, callback: () => void): void {
        this.eventHandler(type, callback);
    };

    @HostListener('hide.bs.modal', ['$event.type', 'this.$params.config.onModalHide'])
    protected hideHandler(type: string, callback: () => void): void {
        this.eventHandler(type, callback);
    };

    @HostListener('hidden.bs.modal', ['$event.type', 'this.$params.config.onModalHidden'])
    protected hiddenHandler(type: string, callback: () => void): void {
        this.eventHandler(type, callback);
    };

    @HostListener('hidePrevented.bs.modal', ['$event.type', 'this.$params.config.onModalHidePrevented'])
    protected hidePreventedHandler(type: string, callback: () => void): void {
        this.eventHandler(type, callback);
    };

}
