import {
    ChangeDetectionStrategy,
    Component, Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
import {
    AbstractComponent,
    GlobalHelper,
    IMixedParams,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    Tournament,
    TournamentsService,
} from 'wlc-engine/modules/tournaments';
import * as Params from 'wlc-engine/modules/tournaments/components/tournament/tournament.params';

import {
    union as _union,
} from 'lodash-es';

@Component({
    selector: '[wlc-tournament]',
    templateUrl: './tournament.component.html',
    styleUrls: ['./styles/tournament.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentComponent
    extends AbstractComponent
    implements OnInit {

    @Input() public inlineParams: Params.ITournamentCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public tournament: Tournament;

    public $params: Params.ITournamentCParams;
    public isAuth: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentCParams,
        protected modalService: ModalService,
        protected tournamentsService: TournamentsService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ITournamentCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod']));
        this.prepareModifiers();

        if (this.$params?.tournament || this.$params?.common?.tournament) {
            this.tournament = this.$params.tournament || this.$params.common.tournament;
        }
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
    }

    public openDescription(): void {
        this.modalService.showModal({
            id: 'tournament-info',
            modalTitle: this.tournament.name,
            modifier: 'info',
            modalMessage: [
                this.tournament.description,
            ],
            dismissAll: false,
        });
    }

    public async join(): Promise<void> {
        // TODO add modal with tournament fee
        const tournament = await this.tournamentsService.joinTournament(this.tournament);
        if (tournament) {
            this.tournament = tournament;
            this.cdr.markForCheck();
        }
    }

    public leave(): void {
        this.modalService.showModal({
            id: 'tournament-leave-confirm',
            modalTitle: gettext('Confirmation'),
            modifier: 'confirmation',
            modalMessage: gettext('Are you sure?'),
            showConfirmBtn: true,
            closeBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('No'),
                },
            },
            confirmBtnText: gettext('Yes'),
            textAlign: 'center',
            onConfirm: async () => {
                const tournament = await this.tournamentsService.leaveTournament(this.tournament);
                if (tournament) {
                    this.tournament = tournament;
                    this.cdr.markForCheck();
                }
            },
            dismissAll: true,
        });
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customMod) {
            modifiers = _union(modifiers, this.$params.common.customMod.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
