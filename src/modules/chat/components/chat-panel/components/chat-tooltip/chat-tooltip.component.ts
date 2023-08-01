import {
    Component,
    ViewChild,
    Input,
    Inject,
    ChangeDetectionStrategy,
    OnInit,
    ElementRef,
    TemplateRef,
    Renderer2,
    NgZone,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {PopoverDirective} from 'ngx-bootstrap/popover';
import {
    BehaviorSubject,
    combineLatest,
    takeUntil,
    Observable,
    timer,
    Subject,
    switchMap,
} from 'rxjs';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';

export type TTooltipState = 'hidden' | 'opened';

@Component({
    selector: '[wlc-chat-tooltip]',
    templateUrl: './chat-tooltip.component.html',
    styleUrls: ['./chat-tooltip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ChatTooltipComponent extends AbstractChatComponent implements OnInit {
    @ViewChild('pop', {static: true}) public tooltip: PopoverDirective;
    @ViewChild('tooltipText', {static: true}) public el: TemplateRef<ElementRef>;
    @Input() public outsideClick: boolean = false;
    @Input() public text: BehaviorSubject<string> = new BehaviorSubject(null);
    @Input() public state: BehaviorSubject<TTooltipState> = new BehaviorSubject(null);
    @Input() public showTime!: number;

    private readonly timerStop$ = new Subject<void>();
    private readonly timerStart$ = new Subject<void>();
    protected timer$!: Observable<number>;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        protected renderer: Renderer2,
        private ngZone: NgZone,
    ) {
        super('wlc-chat-tooltip');
    }

    public ngOnInit(): void {
        combineLatest([this.state, this.text]).pipe(
            takeUntil(this.destroy$),
        ).subscribe(([state, text]) => {
            if (!text || state === 'hidden') {
                this.tooltip.hide();
            } else {
                this.tooltip.show();
                this.timerStart$.next();
            }
        });

        this.timer$ = this.timerStart$.pipe(
            switchMap(() => timer(this.showTime).pipe(
                takeUntil(this.timerStop$),
                takeUntil(this.destroy$)),
            ));
    }

    public onShown(): void {
        const element: Element = this.document.querySelector('popover-container');
        this.renderer.listen(element, 'mouseover', this.onTextHover.bind(this));
        this.renderer.listen(element, 'mouseout', this.onTextLeave.bind(this));

        this.ngZone.runOutsideAngular(() => {
            this.timer$.subscribe(() => {
                this.ngZone.run(() => {
                    this.tooltip.hide();
                });
            });
        });
        this.timerStart$.next();
    }

    public onTextHover(): void {
        this.timerStop$.next();
    }

    public onTextLeave(): void {
        this.timerStart$.next();
    }
}
