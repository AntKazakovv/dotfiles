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
    IButtonCParams,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    AchievementsService,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/services/achievements/achievements.service';
import {
    AchievementModel,
    AchievementGroupModel,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/models';

import * as Params from './achievement-item.params';

@Component({
    selector: '[wlc-achievement-item]',
    templateUrl: './achievement-item.component.html',
    styleUrls: ['./styles/achievement-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AchievementItemComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IAchievementItemCParams;

    public override $params: Params.IAchievementItemCParams;
    public achievement: AchievementModel;
    public showProgress: boolean;
    public buttonParams: IButtonCParams;
    public showButton: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAchievementItemCParams,
        configService: ConfigService,
        protected modalService: ModalService,
        private achievementsService: AchievementsService,
    ) {
        super(
            <IMixedParams<Params.IAchievementItemCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService,
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.achievement = this.$params.achievement;
        this.showProgress = this.$params.showProgress && !this.achievement.isReceived;

        if (this.$params.buttonParams) {
            if (this.achievement.progressTarget in this.$params.buttonParams) {
                this.buttonParams = this.$params.buttonParams[this.achievement.progressTarget];
            } else if (this.achievement.actionUrl && this.achievement.actionTitle) {
                this.buttonParams = this.$params.buttonParams.Empty;
            } else {
                this.buttonParams = null;
            }
        }

        if (this.buttonParams) {
            if (this.achievement.actionTitle) {
                this.buttonParams.common.text = this.achievement.actionTitle;
            }
            if (this.achievement.actionUrl) {
                this.buttonParams.common.sref = null;
                this.buttonParams.common.href = '/' + AchievementModel.currentLang +
                    (this.achievement.actionUrl.startsWith('/')
                        ? this.achievement.actionUrl
                        : '/' + this.achievement.actionUrl);
                this.buttonParams.common.hrefTarget = '_self';
            }
        }

        this.showButton = !this.achievement.isReceived && !!this.buttonParams;
    }

    // MADE FOR CATS #548321
    public get group(): AchievementGroupModel {
        return this.achievementsService.getAchievementGroupById(this.achievement.groupId);
    }

    public openDescription(): void {
        this.modalService.showModal('achievementInfo', {achievement: this.achievement});
    }
}
