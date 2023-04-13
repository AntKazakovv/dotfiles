import {
    Component,
    OnInit,
    Input,
    ChangeDetectorRef,
    Inject,
    HostBinding,
} from '@angular/core';

import {
    filter,
    takeUntil,
} from 'rxjs/operators';

import {
    IMixedParams,
    EventService,
    InjectionService,
    ConfigService,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    Bonus,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {InternalMailsService} from 'wlc-engine/modules/internal-mails';

import * as Params from './counter.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-counter]',
    templateUrl: './counter.component.html',
    styleUrls: ['./styles/counter.component.scss'],
})
export class CounterComponent extends AbstractComponent implements OnInit {
    @HostBinding('hidden') public hidden: boolean;
    public override $params: Params.ICounterCParams;
    public count: number | '9+';

    @Input() public wlcElement: string;
    @Input() protected inlineParams: Params.ICounterCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ICounterCParams,
        protected eventService: EventService,
        configService: ConfigService,
        protected injectionService: InjectionService,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ICounterCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        await this.configService.ready;

        switch (this.$params.type) {
            case ('bonuses-main' || 'bonuses-all'):
                const bonusesService = await this.injectionService
                    .getService<BonusesService>('bonuses.bonuses-service');

                bonusesService.getSubscribe({
                    useQuery: !bonusesService.bonuses?.length,
                    observer: {
                        next: (bonuses: Bonus[]) => {
                            if (bonuses) {
                                bonuses = this.$params.type === 'bonuses-main' ?
                                    bonusesService.filterBonuses(bonuses, 'main'):
                                    bonuses;
                                this.hidden = !bonuses.length && this.$params.hideIfZero;
                                this.count = bonuses.length;
                            }
                            this.cdr.markForCheck();
                        },
                    },
                    type: 'any',
                    until: this.$destroy,
                });
                break;
            case 'store':
                break;
            case 'tournaments':
                break;
            case 'internal-mails':
                const internalMailsService = await this.injectionService
                    .getService<InternalMailsService>('internal-mails.internal-mails-service');

                internalMailsService.unreadMailsCount$
                    .pipe(
                        takeUntil(this.$destroy),
                        filter((value) => {
                            const count = value < 10 ? value : '9+';
                            return this.count !== count;
                        }),
                    )
                    .subscribe((unreadMailsCount: number): void => {
                        if (unreadMailsCount < 10) {
                            this.count = unreadMailsCount;
                            this.hidden = !unreadMailsCount && this.$params.hideIfZero;
                        } else {
                            this.count = '9+';
                            this.hidden = false;
                        }
                        this.cdr.markForCheck();
                    });
                break;
        }
    }
}
