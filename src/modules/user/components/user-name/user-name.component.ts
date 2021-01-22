import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy,
} from '@angular/core';
import {first, skipWhile} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {EventService, ModalService} from 'wlc-engine/modules/core/system/services';
import {IIndexing, IUserInfo} from 'wlc-engine/modules/core/system/interfaces';
import {StateService} from '@uirouter/core';
import * as Params from './user-name.params';

import {
    reduce as _reduce,
    assign as _assign,
} from 'lodash';


@Component({
    selector: '[wlc-user-name]',
    templateUrl: './user-name.component.html',
    styleUrls: ['./styles/user-name.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNameComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() public type: string = 'default';
    @Input() protected inlineParams: Params.IUserNameCParams;
    public $params: any;
    public userStats: IUserInfo;
    public email: string;
    public firstName: string;
    public lastName: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserNameCParams,
        protected configService: ConfigService,
        protected UserService: UserService,
        protected EventService: EventService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.UserService.userProfile$.pipe(skipWhile(v => !v), first())
            .subscribe((userInfo) => {
                this.email = userInfo.email;
                this.firstName = userInfo.firstName;
                this.lastName = userInfo.lastName;
                this.cdr.markForCheck();
            });
    }
}
