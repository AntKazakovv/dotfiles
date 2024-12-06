import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';
import {
    BehaviorSubject,
    pipe,
} from 'rxjs';
import {skip} from 'rxjs/operators';

import {
    AbstractComponent,
    EventService,
    TableAppearanceAnimation,
} from 'wlc-engine/modules/core';
import {
    QuestsService,
    QuestTaskModel,
    IQuestsDataModels,
    QuestModel,
    IQuestProgressCParams,
    IQuest,
} from 'wlc-engine/modules/quests';

import * as Params from './quests-task-list.params';

@Component({
    selector: '[wlc-quests-task-list]',
    templateUrl: './quests-task-list.component.html',
    styleUrls: ['./styles/quests-task-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...TableAppearanceAnimation,
    ],
})

export class QuestsTaskListComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IQuestsTaskListCParams;

    public override $params: Params.IQuestsTaskListCParams;
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public tasksFromActiveQuest$: BehaviorSubject<QuestTaskModel[]> = new BehaviorSubject([]);
    public questProgressParams: IQuestProgressCParams;

    protected questsService: QuestsService = inject(QuestsService);
    protected eventService: EventService = inject(EventService);
    protected router: UIRouter = inject(UIRouter);
    protected questsData: IQuestsDataModels;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IQuestsTaskListCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.questsService.getSubscription({
            useQuery: true,
            modifyData: true,
            observer: {
                next: (data: IQuestsDataModels): void => {
                    if (data) {
                        this.questsData = data;
                        this.init();
                    }

                    if (!this.ready$.value) {
                        this.ready$.next(true);
                    }
                },
            },
            pipes: pipe(
                skip(1),
            ),
            until: this.$destroy,
        });

        this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (): void => {
            this.init();
        }, this.$destroy);
    }

    public get emptyConfig(): Params.IQuestsTaskListCParams['emptyConfig'] {
        return this.$params.emptyConfig;
    }

    protected updateCurrentQuestData(questId: string, questData: Partial<IQuest>): void {
        const updatableQuest: QuestModel = this.questsData.quests.get(questId);
        updatableQuest.updateData(questData);
        this.init();
    }

    protected init(): void {
        if (this.questsData) {
            let questId: string = this.router.globals.params['questId'];

            if (questId && this.questsData.quests.has(questId)) {
                const currentQuest: QuestModel = this.questsData.quests.get(questId);
                const tasksFromActiveQuest: QuestTaskModel[] = questId
                    ? this.questsData.tasks.get(questId)
                    : [];

                this.questProgressParams = {
                    quest: currentQuest,
                    updateQuestData: this.updateCurrentQuestData.bind(this),
                };

                this.tasksFromActiveQuest$.next(tasksFromActiveQuest);
            } else {
                this.questProgressParams = null;
                this.tasksFromActiveQuest$.next([]);
            }
        }
    }
}
