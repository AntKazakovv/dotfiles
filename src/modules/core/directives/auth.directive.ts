import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import {Subject} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';

@Directive({
    // Dynamic component doesn't save the kebabCase in the markup;
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[auth]',
})

export class AuthDirective implements OnInit, OnDestroy {

    @Input()
    public set auth(flag: boolean) {
        this._auth = flag;
        this.isAuth();
    }
    private readonly $destroy: Subject<void> = new Subject();
    private _auth: boolean;

    constructor(
        protected templateRef: TemplateRef<ElementRef>,
        protected viewContainer: ViewContainerRef,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
    }

    public ngOnInit(): void {
        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth();
        }, this.$destroy);
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    protected isAuth(): void {
        if (this._auth === this.configService.get<boolean>('$user.isAuthenticated')) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
