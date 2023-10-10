import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    NgZone,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {
    fromEvent,
    takeUntil,
    throttleTime,
} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionService} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './scroll-up.params';

@Component({
    selector: '[wlc-scroll-up]',
    templateUrl: './scroll-up.component.html',
    styleUrls: ['./styles/scroll-up.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ScrollUpComponent extends AbstractComponent implements OnInit {
    public override $params: Params.IScrollUpParams;
    public windowScrolled: boolean = false;
    public disabledButton: boolean = true;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IScrollUpParams,
        configService: ConfigService,
        protected actionService: ActionService,
        protected elRef: ElementRef,
        private ngZone: NgZone,
        cdr: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private window: Window,
    ){
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        if (!this.$params.showButton) {
            this.elRef.nativeElement.remove();
            return;
        }
        this.ngZone.runOutsideAngular(() => {
            fromEvent(this.window, 'scroll').pipe(
                throttleTime(150),
                takeUntil(this.$destroy),
            ).subscribe(() => {
                this.ngZone.run(() => {
                    this.onWindowScroll();
                    this.cdr.markForCheck();
                });
            });
        });
    }

    public scrollToTop():void {
        if (this.disabledButton) {
            this.actionService.scrollTo();
            this.disabledButton = false;
            setTimeout((): void => {
                this.disabledButton = true;
            }, 1000);
        }
    }

    protected onWindowScroll():void {
        this.windowScrolled = this.document.documentElement.scrollTop > this.document.documentElement.clientHeight;
    }
}
