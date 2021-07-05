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
    skipWhile,
    takeUntil,
} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
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
        protected configService: ConfigService,
        protected UserService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.points = this.UserService.userInfo?.loyalty?.Balance;
        this.cdr.markForCheck();
        this.UserService.userInfo$
            .pipe(
                takeUntil(this.$destroy),
                skipWhile(v => !v),
            )
            .subscribe((userInfo) => {
                this.points = userInfo.loyalty.Balance;
                this.cdr.markForCheck();
            });

    }
}
