import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    HostListener,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionService} from 'wlc-engine/modules/core';
import * as Params from './scroll-up.params';

@Component({
    selector: '[wlc-scroll-up]',
    templateUrl: './scroll-up.component.html',
    styleUrls: ['./styles/scroll-up.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ScrollUpComponent extends AbstractComponent implements OnInit {
    public $params: Params.IScrollUpParams;
    public windowScrolled: boolean = false;
    public disabledButton: boolean = true;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IScrollUpParams,
        protected configService: ConfigService,
        protected actionService: ActionService,
        @Inject(DOCUMENT) private document: Document,
    ){
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
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

    @HostListener('window:scroll')
    protected onScroll():void {
        this.onWindowScroll();
    }

    protected onWindowScroll():void {
        this.windowScrolled = this.document.documentElement.scrollTop > this.document.documentElement.clientHeight;
    }
}
