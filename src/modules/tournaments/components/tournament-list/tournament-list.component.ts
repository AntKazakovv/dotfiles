import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    Tournament,
    TournamentsService,
} from 'wlc-engine/modules/tournaments';
import {
    AbstractComponent,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import * as Params from 'wlc-engine/modules/tournaments/components/tournament-list/tournament-list.params';

@Component({
    selector: '[wlc-tournament-list]',
    templateUrl: './tournament-list.component.html',
    styleUrls: ['./styles/tournament-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentListComponent
    extends AbstractComponent
    implements OnInit {

    public $params: Params.ITournamentListCParams;
    public tournaments: Tournament[];
    public isReady: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentListCParams,
        protected cdr: ChangeDetectorRef,
        protected tournamentsService: TournamentsService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this, []));
        this.getTournaments();
    }

    protected getTournaments(): void {
        this.tournamentsService.getSubscribe({
            useQuery: !this.tournamentsService.hasTournaments,
            observer: {
                next: (tournaments: Tournament[]) => {
                    if (!tournaments) return;

                    this.tournaments = tournaments;
                    this.isReady = true;
                    this.cdr.markForCheck();
                },
            },
        });
    }
}
