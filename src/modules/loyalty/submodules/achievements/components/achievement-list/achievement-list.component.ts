import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    IPaginateOutput,
} from 'wlc-engine/modules/core';
import {
    AchievementsService,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/services/achievements/achievements.service';
import {AchievementModel} from 'wlc-engine/modules/loyalty/submodules/achievements/system/models/achievement.model';

import * as Params from './achievement-list.params';

@Component({
    selector: '[wlc-achievement-list]',
    templateUrl: './achievement-list.component.html',
    styleUrls: ['./styles/achievement-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AchievementListComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IAchievementListCParams;

    public override $params: Params.IAchievementListCParams;
    public ready: boolean = false;
    public achievements: AchievementModel[] = [];
    public paginatedAchievements: AchievementModel[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAchievementListCParams,
        protected achievementsService: AchievementsService,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IAchievementListCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.achievements = await this.achievementsService.getAchievements(this.$params.modifier);
        this.ready = true;
        this.cdr.markForCheck();
    }

    public paginationOnChange(value: IPaginateOutput): void {
        this.paginatedAchievements = value.paginatedItems as AchievementModel[];
    }
}
