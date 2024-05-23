import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {StateService} from '@uirouter/core';
import {
    Subject,
} from 'rxjs';
import {
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';

import * as Params from './lottery-buttons.params';

@Component({
    selector: '[wlc-lottery-buttons]',
    templateUrl: './lottery-buttons.component.html',
    styleUrls: ['./styles/lottery-buttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryButtonsComponent extends AbstractComponent implements OnInit {
    @Input() protected lottery: Lottery;
    @Input() protected update$: Subject<void>;
    @Input() protected inlineParams: Params.ILotteryButtonsCParams;

    public override $params: Params.ILotteryButtonsCParams;

    private isAuth: boolean;
    private userLevel: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryButtonsCParams,
        protected override configService: ConfigService,
        protected override cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected stateService: StateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        await this.configService.ready;

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        this.initSubscribers();
        this.cdr.markForCheck();
    }

    public get showDepositBtn(): boolean {
        return this.isAuth
            && this.lottery?.checkUserLevel
            && !this.lottery.isWaitingForStart
            && !this.lottery.isTicketSaleStopped;
    }

    public showDetails(): void {
        this.stateService.go('app.lotteries-detail', {alias: this.lottery.alias});
    }

    public initSubscribers(): void {
        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
            this.cdr.markForCheck();
        }, this.$destroy);

        this.update$?.pipe(takeUntil(this.$destroy)).subscribe((): void => {
            this.cdr.markForCheck();
        });
    }
}
