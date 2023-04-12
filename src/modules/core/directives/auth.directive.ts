import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';

import {
    BehaviorSubject,
    Subject,
} from 'rxjs';
import {
    takeUntil,
    tap,
} from 'rxjs/operators';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

@Directive({
    // Dynamic component doesn't save the kebabCase in the markup;
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[auth]',
})

export class AuthDirective implements OnInit, OnDestroy {

    @Input('auth') private readonly _auth!: boolean;
    private readonly $destroy: Subject<void> = new Subject();
    private readonly isAuth$: BehaviorSubject<boolean> = this.configService.get('$user.isAuth$');

    constructor(
        protected templateRef: TemplateRef<ElementRef>,
        protected viewContainer: ViewContainerRef,
        protected configService: ConfigService,
    ) {
    }

    public ngOnInit(): void {
        this.isAuth$.pipe(
            takeUntil(this.$destroy),
            tap(this.isAuth.bind(this)),
        ).subscribe();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    protected isAuth(isAuth: boolean): void {
        if (this._auth === isAuth) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
