import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {
    ConfigService,
    EventService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {BetService} from 'wlc-engine/modules/profile/system/services/bet/bet.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './bet-preview.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-bet-preview]',
    templateUrl: './bet-preview.component.html',
    styleUrls: ['./styles/bet-preview.component.scss'],
})
export class BetPreviewComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IBetPreviewParams;
    public date: string;
    public amount: number;

    constructor(
        @Inject('injectParams') protected params: Params.IBetPreviewParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected betService: BetService,
        protected eventService: EventService,
        @Inject(WINDOW) private window: Window,
    ) {
        super(
            <IMixedParams<Params.IBetPreviewParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.date = GlobalHelper.toLocalTime(
            this.$params.bet.DateISO,
            'SQL',
            (this.window.innerWidth < 480) ? this.$params.dateFormat.mobile : this.$params.dateFormat.desktop,
        );
        this.amount = +this.$params.bet.Amount;

    }
}
