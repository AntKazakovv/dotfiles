import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    AchievementGroupModel,
    AchievementsService,
} from 'wlc-engine/modules/loyalty/submodules/achievements';

import * as Params from './achievement-title.params';

@Component({
    selector: '[wlc-achievement-title]',
    templateUrl: './achievement-title.component.html',
    styleUrls: ['./styles/achievement-title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AchievementTitleComponent extends AbstractComponent implements OnInit, OnDestroy {

    public override $params: Params.IAchievementTitleCParams;
    public title: string;

    constructor(
        @Inject('injectParams') protected params: Params.IAchievementTitleCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        private eventService: EventService,
        private achievementsService: AchievementsService,
    ) {
        super(
            <IMixedParams<Params.IAchievementTitleCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    protected init(): void {
        if (this.$params.type === 'achievement-group') {
            this.setTitleByGroup();

            this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, () => {
                this.setTitleByGroup();
            }, this.$destroy);
        } else {
            this.title = this.$params.common?.text;
        }
    }

    /**
     * Set title by group parameter of current state
     *
     * @returns {Promise<void>}
     */
    protected setTitleByGroup(): void {
        const group: AchievementGroupModel = this.achievementsService.getGroupByState();

        if (group) {
            this.title = group.name;
        } else {
            this.title = this.$params.common?.text;
        }

        this.cdr.detectChanges();
    }
}
