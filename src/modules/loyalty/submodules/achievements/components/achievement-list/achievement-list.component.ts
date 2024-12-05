import {
    ChangeDetectionStrategy,
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
    IModifier,
    IAchievementItemCParams,
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
    ) {
        super(
            <IMixedParams<Params.IAchievementListCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        let achievements: AchievementModel[] = await this.achievementsService.getAchievements();

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

        this.getAchievementsFromActiveGroup(AchievementGroupModel.commonGroupId);

        this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (): void => {
            const activeGroup: string = this.router.globals.params['group'];

            this.getAchievementsFromActiveGroup(
                this.groupedAchievements.has(activeGroup) ? activeGroup : AchievementGroupModel.commonGroupId,
            );

            this.cdr.detectChanges();
        }, this.$destroy);

        this.ready = true;
        this.cdr.markForCheck();
    }

    public paginationOnChange(value: IPaginateOutput): void {
        this.paginatedAchievements = value.paginatedItems as AchievementModel[];
        this.cdr.detectChanges();
    }

    public getAchievementsFromActiveGroup(group: string): void {
        this.achievementsFromActiveGroup = this.groupedAchievements.get(group);

        if (this.$params.modifier) {
            this.achievementsFromActiveGroup = this.modifyAchievementsGroup(
                this.achievementsFromActiveGroup,
                this.$params.modifier,
            );
        }
    }

    public modifyAchievementsGroup(achievements: AchievementModel[], modifier: IModifier): AchievementModel[] {
        return this.achievementsService.modifyAchievementArray(achievements, modifier);
    }

    public getItemInlineParams(achievement: AchievementModel): IAchievementItemCParams {
        return {
            achievement: achievement,
            theme: this.$params.themeMod,
            itemParams: this.$params.itemParams,
        };
    }
}
