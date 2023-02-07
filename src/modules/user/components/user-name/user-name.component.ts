import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {
    StateService,
} from '@uirouter/core';

import {
    skipWhile,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import * as Params from './user-name.params';

/**
 * Show user name component
 *
 * @example
 *
 * {
 *     name: 'user.wlc-user-name',
 * }
 *
 */
@Component({
    selector: '[wlc-user-name]',
    templateUrl: './user-name.component.html',
    styleUrls: ['./styles/user-name.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNameComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() public userNameLength: number;
    @Input() public showSvgAsImg: boolean;
    @Input() protected inlineParams: Params.IUserNameCParams;

    public $params: Params.IUserNameCParams;
    public displayedName: string;
    public isAuth: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserNameCParams,
        protected configService: ConfigService,
        protected userService: UserService,
        protected eventService: EventService,
        protected stateService: StateService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.$params.userNameLength = this.userNameLength || this.$params.userNameLength;
        this.$params.showSvgAsImg = this.showSvgAsImg || this.$params.showSvgAsImg;

        this.userService.userProfile$.pipe(
            skipWhile(v => !v),
            takeUntil(this.$destroy),
        )
            .subscribe((userInfo) => {
                this.isAuth = this.configService.get('$user.isAuthenticated');

                if (userInfo.firstName || userInfo.lastName) {
                    this.displayedName = `${userInfo.firstName} ${userInfo.lastName}`.trim();
                } else if (userInfo.email) {
                    this.displayedName = userInfo.email;
                } else {
                    this.displayedName = gettext('User');
                }
                this.cdr.markForCheck();
            });
    }

    public modalSignupOrLogin(): void {
        if (GlobalHelper.isMobileApp()) {
            this.eventService.emit({
                name: 'SHOW_MODAL',
                data: 'login',
            });
            return;
        }

        this.eventService.emit({
            name: 'SHOW_MODAL',
            data: 'signup',
        });
    }

    public openProfile(): void {
        this.stateService.go('app.profile.main.info');
    }
}
