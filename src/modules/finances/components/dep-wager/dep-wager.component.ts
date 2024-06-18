import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
    Inject,
    Input,
} from '@angular/core';

import {
    BehaviorSubject,
} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {DepWagerController} from 'wlc-engine/modules/finances/system/classes/dep-wager.controller';
import {DepWagerModel} from '../../system/models/dep-wager.model';

import * as Params from './dep-wager.params';

@Component({
    selector: '[wlc-dep-wager]',
    templateUrl: './dep-wager.component.html',
    styleUrls: ['./styles/dep-wager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        DepWagerController,
    ],
})

export class DepWagerComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IDepWagerCParams;

    public override $params: Params.IDepWagerCParams;
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public depWagerModel$: BehaviorSubject<DepWagerModel> = new BehaviorSubject(null);

    protected financesService: FinancesService = inject(FinancesService);
    protected controller: DepWagerController = inject(DepWagerController);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepWagerCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        if (!this.configService.get<boolean>('$finances.depositWager.use')) {
            this.ready$.next(true);
            return;
        }

        await this.controller.init();
        this.ready$ = this.controller.ready$;
        this.depWagerModel$ = this.controller.depWagerModel$;
        this.cdr.markForCheck();
    }

    public get translationsContext(): Record<string, string | number> {
        return {
            wager: this.controller.wager,
        };
    }

    public get hasDeposit(): boolean {
        return this.controller.hasDeposit;
    }
}
