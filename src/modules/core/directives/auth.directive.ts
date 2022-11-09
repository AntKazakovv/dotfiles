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
    private isAuthenticated: boolean = this.configService.get('$user.isAuthenticated');

    constructor(
        protected templateRef: TemplateRef<ElementRef>,
        protected viewContainer: ViewContainerRef,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
    }

    public ngOnInit(): void {
        this.eventService.subscribe({
            name: 'LOGOUT',
        }, (): void => {
            this.isAuthenticated = false;
            this.isAuth();
        }, this.$destroy);

        this.eventService.subscribe({
            name: 'LOGIN',
        }, ():void => {
            this.isAuthenticated = true;
            this.isAuth();
        }, this.$destroy);
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    protected isAuth(): void {
        if (this._auth === this.isAuthenticated) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
