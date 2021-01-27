import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy,
} from '@angular/core';
import {first, skipWhile} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {IUserInfo} from 'wlc-engine/modules/core/system/interfaces';
import * as Params from './dashboard-loyalty-block.params';

import {
    reduce as _reduce,
    assign as _assign,
} from 'lodash';

@Component({
    selector: '[wlc-dashboard-loyalty-block]',
    templateUrl: './dashboard-loyalty-block.component.html',
    styleUrls: ['./styles/dashboard-loyalty-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLoyaltyBlockComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ILoyaltyProgressCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgressCParams,
        protected configService: ConfigService,
        protected UserService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.UserService.userInfo$.pipe(skipWhile(v => !v))
            .subscribe((userInfo) => {
                this.cdr.markForCheck();
            });
    }
}
