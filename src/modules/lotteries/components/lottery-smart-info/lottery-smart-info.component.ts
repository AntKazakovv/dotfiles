import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    Output,
    EventEmitter,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';

import * as Params from './lottery-smart-info.params';

@Component({
    selector: '[wlc-lottery-smart-info]',
    templateUrl: './lottery-smart-info.component.html',
    styleUrls: ['./styles/lottery-smart-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotterySmartInfoComponent extends AbstractComponent implements OnInit {
    @Input() public lottery: Lottery;
    @Input() protected inlineParams: Params.ILotterySmartInfoCParams;
    @Output() public timerEnds: EventEmitter<void> = new EventEmitter();

    public override $params: Params.ILotterySmartInfoCParams;
    private isAuth: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotterySmartInfoCParams,
        protected override configService: ConfigService,
        protected override cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
            this.cdr.markForCheck();
        }, this.$destroy);
    }

    public get showTicketsCounter(): boolean {
        return this.isAuth;
    }

    public updateView(): void {
        this.timerEnds.emit();
        this.cdr.markForCheck();
    }
}
