import {
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {StateService} from '@uirouter/core';

import {
    skipWhile,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
    ModalService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';

import * as Params from './welcome.params';

/**
 * Component for welcome page
 *
 * @example
 *
 * {
 *     name: 'mobile.wlc-welcome',
 * }
 *
 */
@Component({
    selector: '[wlc-welcome]',
    templateUrl: './welcome.component.html',
    styleUrls: ['./styles/welcome.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent extends AbstractComponent implements OnInit {
    public $params!: Params.IWelcomeCParams;
    public isAuth: boolean = false;
    public isReady: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IWelcomeCParams,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected stateService: StateService,
        protected configService: ConfigService,
        protected injectionService: InjectionService,
        protected userService: UserService,
    ) {
        super(
            <IMixedParams<Params.IWelcomeCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    public async init(): Promise<void> {
        this.authStatus();
        this.isReady = true;
        this.cdr.detectChanges();
    }

    /**
     * Handler for signIn action
     */
    public signIn(): void {
        this.modalService.showModal('login');
    }

    /**
     * Handler for signUp action
     */
    public signUp(): void {
        this.modalService.showModal('signup');
    }

    protected authStatus(): void {
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.userService.userProfile$.pipe(
            skipWhile(v => !v),
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
            if (this.isAuth) {
                this.stateService.go('app.home');
            }
            this.cdr.detectChanges();
        });
    }
}
