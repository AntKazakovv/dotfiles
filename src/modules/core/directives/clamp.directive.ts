import {
    Directive,
    ElementRef,
    AfterViewInit,
    Input,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';

import {
    takeUntil,
    distinctUntilChanged,
    map,
} from 'rxjs/operators';
import {Subject} from 'rxjs';

import _ceil from 'lodash-es/ceil';

import {
    ActionService,
    IResizeEvent,
} from 'wlc-engine/modules/core/system/services/action/action.service';
import {DeviceOrientation} from 'wlc-engine/modules/core/system/models/device.model';
import {WINDOW} from 'wlc-engine/modules/app/system';

@Directive({
    selector: '[wlc-clamp]',
})
/**
 * @deprecated
 * Will be removed
 */
export class ClampDirective implements OnInit, AfterViewInit, OnDestroy {
    @Input('wlc-clamp') lines: number;
    private readonly $destroy: Subject<void> = new Subject();

    constructor(
        protected element: ElementRef,
        protected actionService: ActionService,
        @Inject(WINDOW) protected window: Window,
    ) {}

    public ngOnInit(): void {
        this.actionService.windowResize()
            .pipe(
                map((event: IResizeEvent): DeviceOrientation => event.device.orientation),
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((): void => {
                setTimeout((): void => {
                    this.lineClamp();
                }, 0);
            });
    }

    public ngAfterViewInit(): void {
        this.lineClamp();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    protected lineClamp(): void {
        if (!this.lines) {
            const styles = this.window.getComputedStyle(this.element.nativeElement);
            const lineHeight: number = parseInt(styles.lineHeight);
            const height: number = parseInt(styles.height);
            this.lines = _ceil(height/lineHeight);
        }

        this.setClampStyle();
    }

    /**
     * Adds styles to clip the string and add an ellipsis at the end of the ellipsis
     * @private
     */
    private setClampStyle(): void {
        const style: CSSStyleDeclaration = this.element.nativeElement.style;
        style.display = '-webkit-box';
        style.webkitLineClamp = `${this.lines}`;
        style.webkitBoxOrient = 'vertical';
        style.overflow = 'hidden';
    }
}
