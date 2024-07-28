import {
    Component,
    OnInit,
    Input,
    Inject,
    HostBinding,
    ChangeDetectionStrategy,
} from '@angular/core';

import {
    filter,
    takeUntil,
} from 'rxjs/operators';

import {
    IMixedParams,
    EventService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    Bonus,
    BonusesFilterType,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {InternalMailsService} from 'wlc-engine/modules/internal-mails';

import * as Params from './counter.params';

@Component({
    selector: '[wlc-counter]',
    templateUrl: './counter.component.html',
    styleUrls: ['./styles/counter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.ICounterCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        await this.configService.ready;

        switch (this.$params.type) {
            case ('bonuses-main'):
            case ('bonuses-all'):
                const bonusesService = await this.injectionService
                    .getService<BonusesService>('bonuses.bonuses-service');

                this.count = 0;
                bonusesService.getSubscribe({
                    useQuery: !bonusesService.bonuses?.length,
                    observer: {
                        next: (bonuses: Bonus[]) => {
                            if (bonuses) {
                                let filter: BonusesFilterType = null;
                                if (
                                    this.$params.type === 'bonuses-all' ||
                                        this.configService.get<boolean>('$bonuses.showAllInProfile')
                                ) {
                                    filter = 'all';
                                } else if (this.$params.type === 'bonuses-main') {
                                    filter = 'main';
                                }

                                bonuses = filter ?
                                    bonusesService.filterBonuses(bonuses, filter):
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

                this.cdr.markForCheck();

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
                        filter((value) => {
                            const count = value < 10 ? value : '9+';
                            return this.count !== count;
                        }),
                        takeUntil(this.$destroy),
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
