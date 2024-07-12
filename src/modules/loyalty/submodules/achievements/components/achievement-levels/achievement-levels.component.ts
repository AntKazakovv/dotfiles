import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    AchievementModel,
    TAchievementLevelInfo,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/models/achievement.model';

import * as Params from './achievement-levels.params';

@Component({
    selector: '[wlc-achievement-levels]',
    templateUrl: './achievement-levels.component.html',
    styleUrls: ['./styles/achievement-levels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementLevelsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IAchievementLevelsCParams;
    @Input() public achievement: AchievementModel;

    public override $params: Params.IAchievementLevelsCParams;
    public levelsData: Params.ILevelData[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAchievementLevelsCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.achievement ??= this.$params.achievement;

        if (this.achievement?.levelsInfo?.length) {
            this.levelsData = this.achievement.levelsInfo.map(
                (level: TAchievementLevelInfo, index: number): Params.ILevelData => ({
                    name: this.$params.levelNameGenerateFn?.(level.name, index) || level.name,
                    description: level.description,
                    isCompleted: this.achievement.isReceived || index < this.achievement.progressCurrent,
                    isCurrent: !this.achievement.isReceived && index === this.achievement.progressCurrent,
                }),
            );
        }
    }
}
