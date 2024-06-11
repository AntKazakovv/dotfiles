import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Inject,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    QuestsService,
    QuestModel,
} from 'wlc-engine/modules/quests';

import * as Params from './quests-title.params';

@Component({
    selector: '[wlc-quests-title]',
    templateUrl: './quests-title.component.html',
    styleUrls: ['./styles/quests-title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestsTitleComponent extends AbstractComponent implements OnInit {
    public override $params: Params.IQuestsTitleCParams;
    public title!: string;

    protected eventService: EventService = inject(EventService);
    protected questsService: QuestsService = inject(QuestsService);

    constructor(
        @Inject('injectParams') protected params: Params.IQuestsTitleCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        if (this.$params.type === 'state') {
            this.setTitleByGroup();

            this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (): void => {
                this.setTitleByGroup();
            }, this.$destroy);
        } else {
            this.title = this.$params.text;
        }
    }

    /**
     * Set title by quest parameter of current state
     *
     * @returns {void}
     */
    protected async setTitleByGroup(): Promise<void> {
        const quest: QuestModel | null = await this.questsService.getQuestByState();

        this.title = quest?.name || this.$params.text;

        this.cdr.markForCheck();
    }
}
