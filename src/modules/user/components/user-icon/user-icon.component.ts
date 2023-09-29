import {
    AfterViewInit,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import {
    fromEvent,
    takeUntil,
} from 'rxjs';

import _isUndefined from 'lodash-es/isUndefined';

import {
    AbstractComponent,
    EventService,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './user-icon.params';

@Component({
    selector: 'div[wlc-user-icon], button[wlc-user-icon]',
    templateUrl: './user-icon.component.html',
    styleUrls: ['./styles/user-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserIconComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() protected inlineParams: Params.IUserIconCParams;
    public override $params: Params.IUserIconCParams;
    public showArrow: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserIconCParams,
        private elementRef: ElementRef,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.showArrow = this.elementRef.nativeElement.tagName === 'BUTTON' && this.$params.theme !== 'avatar';
        if (_isUndefined(this.$params.showAsBtn)) {
            this.$params.showAsBtn = this.elementRef.nativeElement.tagName === 'BUTTON';
        }
        if (this.$params.useDefaultAvatar && this.$params.theme === 'avatar') {
            this.$params.iconPath = Params.defaultAvatar;
        }
    }

    public ngAfterViewInit(): void {
        if (this.$params.event) {
            fromEvent(this.elementRef.nativeElement, 'click')
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    this.eventService.emit(this.$params.event);
                });
        }
    }
}
