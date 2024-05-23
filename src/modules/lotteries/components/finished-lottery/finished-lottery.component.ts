import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
} from '@angular/core';
import {
    animate,
    style,
    transition,
    trigger,
} from '@angular/animations';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {BaseLottery} from 'wlc-engine/modules/lotteries/system/models/base-lottery.model';

import * as Params from './finished-lottery.params';

@Component({
    selector: '[wlc-finished-lottery]',
    templateUrl: './finished-lottery.component.html',
    styleUrls: ['./styles/finished-lottery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('expand', [
            transition(':enter', [
                style({opacity: '0'}),
                animate('0.25s', style({opacity: '1'})),
            ]),
            transition(':leave', [
                animate('0.15s', style({opacity: '0'})),
            ]),
        ]),
    ],
})

export class FinishedLotteryComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IFinishedLotteryCParams;
    @Input() public lottery: BaseLottery;

    public override $params: Params.IFinishedLotteryCParams;
    public isExpanded: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFinishedLotteryCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public toggleView(): void {
        this.isExpanded = !this.isExpanded;
        this.toggleModifiers('expanded');
    }
}
