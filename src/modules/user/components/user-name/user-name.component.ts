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
import {AbstractComponent, ConfigService} from 'wlc-engine/modules/core';
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
    @Input() public showSvgAsImg: boolean;
    @Input() protected inlineParams: Params.IUserNameCParams;
    public $params: Params.IUserNameCParams;
    public displayedName: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserNameCParams,
        protected configService: ConfigService,
        protected UserService: UserService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.$params.userNameLength = this.userNameLength || this.$params.userNameLength;
        this.$params.showSvgAsImg = this.showSvgAsImg || this.$params.showSvgAsImg;
        this.UserService.userProfile$.pipe(
            skipWhile(v => !v),
            takeUntil(this.$destroy),
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
