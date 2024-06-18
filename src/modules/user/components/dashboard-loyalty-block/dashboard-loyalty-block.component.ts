import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';

import {skipWhile, takeUntil} from 'rxjs/operators';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {AppType} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ModalService} from 'wlc-engine/modules/core/system/services';

import * as Params from './dashboard-loyalty-block.params';

@Component({
    selector: '[wlc-dashboard-loyalty-block]',
    templateUrl: './dashboard-loyalty-block.component.html',
    styleUrls: ['./styles/dashboard-loyalty-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLoyaltyBlockComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ILoyaltyBlockCParams;
    @Input() protected isGameDashboard: boolean;

    public override $params: Params.ILoyaltyBlockCParams;
    public isKiosk: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyBlockCParams,
        protected UserService: UserService,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.isKiosk = this.configService.get<AppType>('$base.app.type') === 'kiosk';
        this.$params.isGameDashboard = this.isGameDashboard || this.$params.isGameDashboard;

        this.UserService.userInfo$
            .pipe(
                skipWhile(v => !v),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                this.cdr.markForCheck();
            });
    }
}
