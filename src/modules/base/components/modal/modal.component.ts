import {Modal} from 'bootstrap';
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
} from '@angular/core';

import {
    IModalOptions,
    IModalBsOptions,
    defaultParams,
} from './index';
import {EventService} from 'wlc-engine/modules/core/services';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/classes/abstract.component';

import {
    isString as _isString,
    assign as _assign,
    assignIn as _assignIn,
} from 'lodash';

@Component({
    selector: 'wlc-modal-window',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.wlc-modal]': 'true',
        'role': 'dialog',
        'tabindex': '-1',
        '[attr.aria-modal]': 'true',
        '[attr.aria-hidden]': 'true',
        '[class.fade]': '$params.config.animation',
        '[attr.id]': '$params.config.id',
    },
})
export class WlcModalComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {
    public $params: IModalOptions;
    public dialogClasses: string[] = [];
    public modalDirect: Modal;
    public inject: Injector;

    @Input() protected inlineParams: IModalOptions;

    protected bsOptions: IModalBsOptions = {};

    constructor(
        @Inject('injectParams') protected params: IModalOptions,
        protected eventService: EventService,
        protected injector: Injector,
        private hostElement: ElementRef,
    ) {
        super(<IMixedParams<IModalOptions>>{
            injectParams: params,
            defaultParams: defaultParams
        });
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.applyConfig();
    }

    public ngAfterViewInit(): void {
        this.modalDirect = new Modal(this.hostElement.nativeElement, this.bsOptions);
        this.modalDirect.show();
    }

    public confirm(): void {
        const {config} = this.$params;

        if (config.onConfirm) {
            config.onConfirm();
        }

        this.modalDirect.hide();
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
            this.inject = Injector.create({
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: config.componentParams || {},
                    }
                ],
                parent: this.injector
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
