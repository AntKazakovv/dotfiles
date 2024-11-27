import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    Input,
    inject,
} from '@angular/core';

import {Dayjs} from 'dayjs';

import {
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';
import {Marathon} from 'wlc-engine/modules/tournaments/system/models/marathon.model';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {IPromoCodeLinkCParams} from 'wlc-engine/modules/core/components/promocode-link/promocode-link.params';

import * as Params from './marathon-banner.params';

@Component({
    selector: '[wlc-marathon-banner]',
    templateUrl: './marathon-banner.component.html',
    styleUrls: ['./styles/marathon-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarathonBannerComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IMarathonBannerCParams;

    public override $params: Params.IMarathonBannerCParams;
    public headerImagePath!: string;
    public promoCodeLinkParams!: IPromoCodeLinkCParams;

    protected readonly tournamentsService: TournamentsService = inject(TournamentsService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMarathonBannerCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.headerImagePath = this.marathon.image || this.$params.imagePathMain;

        if (this.$params.promoCodeLinkParams) {
            this.promoCodeLinkParams = this.getPromoCodeLinkParams();
        }
    }

    public updateMarathon(): void {
        this.$params.updateMarathonFn?.();
    }

    public get marathon(): Marathon {
        return this.$params.marathon;
    }

    public get marathonName(): string {
        return this.marathon.name;
    }

    public get marathonDescription(): string {
        return this.marathon.descriptionClean;
    }

    public get marathonExpireTime(): Dayjs {
        return this.marathon.stateDateTournament;
    }

    public get marathonServerTime(): number {
        return this.marathon.serverTime;
    }

    public get timerText(): string {
        return this.$params.timerText;
    }

    protected getPromoCodeLinkParams(): IPromoCodeLinkCParams {
        return {
            ...this.$params.promoCodeLinkParams,
            onSubmit: this.onPromoCodeSubmit.bind(this),
        };
    }

    protected onPromoCodeSubmit(): void {
        const enteredPromoCode: string = this.$params.promoCodeLinkParams?.registrationPromoCode?.control?.value;

        if (!enteredPromoCode) {
            return;
        }

        const targetLeague: League = this.marathon.leagues.find(
            (league: League): boolean => league.promoCodes.includes(enteredPromoCode),
        );

        if (targetLeague) {
            this.tournamentsService.joinTournament<League>(targetLeague).then((league: League | undefined): void => {
                if (league) {
                    this.$params.promoCodeLinkParams.registrationPromoCode.control.setValue('');
                }
            });
        } else {
            this.tournamentsService.showError(
                gettext('Promo code error'),
                [gettext('No voucher found')],
            );
        }
    };
}
