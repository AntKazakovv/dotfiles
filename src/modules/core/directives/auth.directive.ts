import {
    ChangeDetectorRef,
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[auth]',
})

export class AuthDirective implements OnChanges {

    constructor(
        protected templateRef: TemplateRef<any>,
        protected viewContainer: ViewContainerRef,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
    }

    @Input() set auth(flag: boolean) {
        this.isAuthCheck(flag);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuthCheck(changes.auth.currentValue);
            this.cdr.markForCheck();
        });
    }

    protected isAuthCheck(flag: boolean): void {
        if (flag === this.configService.get<boolean>('$user.isAuthenticated')) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
