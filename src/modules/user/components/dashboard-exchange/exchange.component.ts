import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {
    skipWhile,
    takeUntil,
} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ModalService} from 'wlc-engine/modules/core/system/services';

import * as Params from './exchange.params';

@Component({
    selector: '[wlc-exchange]',
    templateUrl: './exchange.component.html',
    styleUrls: ['./styles/exchange.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.IDashboardExchangeCParams;
    public points: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDashboardExchangeCParams,
        protected UserService: UserService,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.points = this.UserService.userInfo?.loyalty?.Balance;
        this.cdr.markForCheck();
        this.UserService.userInfo$
            .pipe(
                skipWhile(v => !v),
                takeUntil(this.$destroy),
            )
            .subscribe((userInfo) => {
                this.points = userInfo.loyalty.Balance;
                this.cdr.markForCheck();
            });

    }
}
