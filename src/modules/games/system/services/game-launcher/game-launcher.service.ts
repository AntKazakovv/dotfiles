import {
    Injectable,
    Injector,
} from '@angular/core';

import {
    ConfigService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {IGameLaunch} from 'wlc-engine/modules/games/system/interfaces/game-launch.interface';
import {
    GAME_LAUNCH_STORAGE_KEY,
    GAME_LAUNCH_STORAGE_TYPE,
} from 'wlc-engine/modules/games/system/constants/game-launch.constants';

@Injectable({providedIn: 'root'})
export class GameLauncherService {
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        protected configService: ConfigService,
        protected eventService: EventService,
        protected injector: Injector,
        protected logService: LogService,
    ) {}

    public init(): void {
        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            this.launch();
        } else {
            this.listenAuthEvents();
            this.clearFromStorage();
        }
    }

    public getFromStorage(): IGameLaunch {
        return this.configService.get({
            name: GAME_LAUNCH_STORAGE_KEY,
            storageType: GAME_LAUNCH_STORAGE_TYPE,
        });
    }

    private async launch(): Promise<void> {
        const gameLaunch = this.getFromStorage();

        if (gameLaunch) {
            try {
                if (gameLaunch.launchCode) {
                    const game = await this.gamesCatalogService.getGame(gameLaunch.merchantID, gameLaunch.launchCode);
                    game.launch({demo: false});
                }
            } catch (e) {
                this.logService.sendLog({
                    code: '3.0.4',
                    from: {service: 'GameLauncherService'},
                });
            } finally {
                this.clearFromStorage();
            }
        }
    }

    private listenAuthEvents(): void {
        this.eventService.subscribe({name: 'LOGIN'}, this.launch.bind(this));
    }

    private clearFromStorage(): void {
        this.configService.set({
            value: null,
            name: GAME_LAUNCH_STORAGE_KEY,
            storageType: GAME_LAUNCH_STORAGE_TYPE,
            storageClear: GAME_LAUNCH_STORAGE_TYPE,
        });
    }
}
