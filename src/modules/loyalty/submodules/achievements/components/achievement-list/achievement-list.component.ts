import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';
import _forEach from 'lodash-es/forEach';
import _orderBy from 'lodash-es/orderBy';
import _filter from 'lodash-es/filter';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IMixedParams,
    IPaginateOutput,
} from 'wlc-engine/modules/core';
import {
    AchievementsService,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/services/achievements/achievements.service';
import {
    AchievementModel,
    AchievementGroupModel,
} from 'wlc-engine/modules/loyalty/submodules/achievements';

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
    /**
     * All achievements grouped into groups
     * **/
    public groupedAchievements: Map<string, AchievementModel[]> = new Map();
    /**
     * Achievements of active group
     * **/
    public achievementsFromActiveGroup: AchievementModel[] = [];
    /**
     * Achievements of active group into current page
     * **/
    public paginatedAchievements: AchievementModel[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAchievementListCParams,
        private achievementsService: AchievementsService,
        private eventService: EventService,
        private router: UIRouter,
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

        let achievements: AchievementModel[] = await this.achievementsService.getAchievements(this.$params.modifier);

        if (this.$params.hideReceived) {
            achievements = _filter(achievements, (achievement: AchievementModel) => !achievement.isReceived);
        }

        achievements = _orderBy(
            achievements,
            [
                (achievement: AchievementModel) => achievement.progressPercent,
                (achievement: AchievementModel) => achievement.id,
            ],
            [this.$params.achievementsOrder, 'asc'],
        );

        this.groupedAchievements.set(AchievementGroupModel.commonGroupId, achievements);
        _forEach(achievements, (achievement: AchievementModel) => {
            const groupId: string = achievement.groupId.toString();

            if (!this.groupedAchievements.has(groupId)) {
                this.groupedAchievements.set(groupId, []);
            }

            this.groupedAchievements.get(groupId).push(achievement);
        });

        this.achievementsFromActiveGroup = this.groupedAchievements.get(AchievementGroupModel.commonGroupId);
        this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (): void => {
            const activeGroup: string = this.router.globals.params['group'];

            if (this.groupedAchievements.has(activeGroup)) {
                this.achievementsFromActiveGroup = this.groupedAchievements.get(activeGroup);
            } else {
                this.achievementsFromActiveGroup = this.groupedAchievements.get(AchievementGroupModel.commonGroupId);
            }

            this.cdr.detectChanges();
        }, this.$destroy);

        this.ready = true;
        this.cdr.markForCheck();
    }

    public paginationOnChange(value: IPaginateOutput): void {
        this.paginatedAchievements = value.paginatedItems as AchievementModel[];
        this.cdr.detectChanges();
    }
}
