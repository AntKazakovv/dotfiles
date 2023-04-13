import {
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {StateService} from '@uirouter/core';

import {
    skipWhile,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    Game,
    GamesCatalogService,
} from 'wlc-engine/modules/games';

import * as Params from './favourite-button.params';

@Component({
    selector: '[wlc-favourite-button]',
    templateUrl: './favourite-button.component.html',
    styleUrls: ['./styles/favourite-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouriteButtonComponent extends AbstractComponent implements OnInit {
    public override $params!: Params.IFavouriteButtonCParams;
    public isAuth: boolean = false;
    public isReady: boolean = false;
    public game!: Game;

    constructor(
        @Inject('injectParams') protected params: Params.IFavouriteButtonCParams,
        cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected stateService: StateService,
        configService: ConfigService,
        protected gamesCatalogService: GamesCatalogService,
        protected userService: UserService,
    ) {
        super(
            <IMixedParams<Params.IFavouriteButtonCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr,
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    public async init(): Promise<void> {
        this.authStatus();
        await this.gamesCatalogService.ready;

        this.game = this.$params.game || this.gamesCatalogService.getGameByState();
        this.isReady = true;
        this.cdr.detectChanges();
    }

    public async toggleFavourites(): Promise<void> {
        if (!this.game) {
            return;
        }

        try {
            this.game.isFavourite = await this.gamesCatalogService.toggleFavourites(this.game.ID);
            this.cdr.detectChanges();
        } catch (error) {
            // TODO handle error
        }
    }

    protected authStatus(): void {
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.userService.userProfile$.pipe(
            skipWhile(v => !v),
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
            this.cdr.detectChanges();
        });
    }
}
