import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {
    StateService,
} from '@uirouter/core';

import {
    map,
    skipWhile,
} from 'rxjs/operators';
import {
    BehaviorSubject,
    Observable,
} from 'rxjs';

import {
    AbstractComponent,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import * as Params from './user-name.params';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

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
    @Input() public showUserId: boolean;
    @Input() protected inlineParams: Params.IUserNameCParams;

    public override $params: Params.IUserNameCParams;
    public isAuth$: BehaviorSubject<boolean> = this.userService.isAuth$;
    public displayedName$: Observable<string> = this.userService.userProfile$.pipe(
        skipWhile(v => !v),
        map(this.processDisplayName.bind(this)),
    );
    protected userId: string;
    protected useNick: boolean = this.configService.get<boolean>('$base.profile.nicknameIcon.use');

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserNameCParams,
        protected userService: UserService,
        protected eventService: EventService,
        protected stateService: StateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.$params.userNameLength = this.userNameLength || this.$params.userNameLength;
        this.$params.showSvgAsImg = this.showSvgAsImg || this.$params.showSvgAsImg;
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

    @CustomHook({module: 'user', class: 'UserNameComponent', method: 'processDisplayName'})
    protected processDisplayName({firstName, lastName, email, idUser, nickname}: UserProfile): string {
        let name: string = gettext('User');

        if (this.useNick && nickname) {
            name = nickname;
        } else if (firstName || lastName) {
            name = `${firstName} ${lastName}`.trim();
        } else if (email) {
            name = email;
        }

        this.$params.showUserId = this.showUserId || this.$params.showUserId;

        if (this.$params.showUserId) {
            this.userId = `ID: ${idUser}`;
        }

        return name;
    }
}
