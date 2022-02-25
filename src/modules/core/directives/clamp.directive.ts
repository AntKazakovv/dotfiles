import {
    Directive,
    ElementRef,
    AfterViewInit,
    Input,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';

import * as clampLib from 'text-overflow-clamp';

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
                takeUntil(this.$destroy),
                map((event: IResizeEvent): DeviceOrientation => event.device.orientation),
                distinctUntilChanged(),
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
        clampLib(this.element.nativeElement, this.lines);
    }
}
