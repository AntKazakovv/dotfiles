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
import {AchievementModel} from 'wlc-engine/modules/loyalty/submodules/achievements/system/models/achievement.model';

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
        this.buttonParams = this.$params.buttonParams?.[this.achievement.progressTarget];
        this.showButton = !this.achievement.isReceived && !!this.buttonParams;
    }

    public openDescription(): void {
        this.modalService.showModal('achievementInfo', {achievement: this.achievement});
    }
}
