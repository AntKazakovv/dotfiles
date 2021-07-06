import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {skipWhile, takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {UserService} from 'wlc-engine/modules/user/system/services';
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
    @Input() protected inlineParams: Params.IUserNameCParams;
    public $params: Params.IUserNameCParams;
    public displayedName: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserNameCParams,
        protected UserService: UserService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.$params.userNameLength = this.userNameLength || this.$params.userNameLength;
        this.UserService.userProfile$.pipe(
            takeUntil(this.$destroy),
            skipWhile(v => !v),
        )
            .subscribe((userInfo) => {
                if (userInfo.firstName || userInfo.lastName) {
                    this.displayedName = `${userInfo.firstName} ${userInfo.lastName}`.trim();
                } else {
                    this.displayedName = userInfo.email;
                }
                this.cdr.markForCheck();
            });
    }
}
