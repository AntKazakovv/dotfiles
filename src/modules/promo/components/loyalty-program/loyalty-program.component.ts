import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';

import {
    AbstractComponent,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelsService} from 'wlc-engine/modules/promo/system/services/loyalty-levels/loyalty-levels.service';
import {LoyaltyLevelModel} from 'wlc-engine/modules/promo/system/models/loyalty-level.model';

import * as Params from './loyalty-program.params';

@Component({
    selector: '[wlc-loyalty-program]',
    templateUrl: './loyalty-program.component.html',
    styleUrls: ['./styles/loyalty-program.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgramComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILoyaltyProgramCParams;
    public levels: LoyaltyLevelModel[] = [];
    public ready = false;
    public isAuth: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgramCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected loyaltyLevelsService: LoyaltyLevelsService,
        protected modalService: ModalService,
        protected router: UIRouter,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        await this.configService.ready;
        this.isAuth = this.configService.get('$user.isAuthenticated');

        this.levels = (await this.loyaltyLevelsService.getLoyaltyLevels()).splice(0, this.$params.levelsLimit);
        this.ready = true;
        this.cdr.detectChanges();
    }

    public imageLevel(level: number): string {
        return `${this.$params.imagePath}${level}.${this.$params.imageType}`;
    }

    public readMore(): void {
        if (this.isAuth) {
            this.router.stateService.go('app.profile.loyalty-level');
        } else {
            this.modalService.showModal('loyaltyInfo');
        }
    }

    public setLoyaltyPoints(index: number): string {
        return `${index ? this.levels[index - 1].nextLevelPoints : 0} - ${this.levels[index].nextLevelPoints}`;
    }
}
