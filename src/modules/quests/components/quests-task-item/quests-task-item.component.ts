import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IButtonCParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {QuestTaskModel} from 'wlc-engine/modules/quests';

import * as Params from './quests-task-item.params';

@Component({
    selector: '[wlc-quests-task-item]',
    templateUrl: './quests-task-item.component.html',
    styleUrls: ['./styles/quests-task-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class QuestsTaskItemComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IQuestsTaskItemCParams;
    @Input() public task: QuestTaskModel;

    public override $params: Params.IQuestsTaskItemCParams;
    public taskImagePath!: string;
    public taskImagePathFallback!: string;
    public taskStatusIconPath!: string;
    public taskStatusIconPathFallback!: string;
    public modalButtonParams: IButtonCParams;
    public showModalButton!: boolean;
    public progressDetails!: string;

    protected modalService: ModalService = inject(ModalService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IQuestsTaskItemCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.task ??= this.$params.task;

        this.prepareModalButtonParams();

        if (this.task.progressCurrent === this.task.progressTotal) {
            this.taskImagePath = this.task.imageActive || this.$params.pathsToIcons.activeTask;
            this.taskImagePathFallback = this.$params.pathsToFallbackIcons.activeTask;

            this.taskStatusIconPath = this.$params.pathsToIcons.completedStatus;
            this.taskStatusIconPathFallback = this.$params.pathsToFallbackIcons.completedStatus;

            this.showModalButton = false;

            this.addModifiers('completed');
        } else {
            this.taskImagePath = this.task.imageNotActive || this.$params.pathsToIcons.notActiveTask;
            this.taskImagePathFallback = this.$params.pathsToFallbackIcons.notActiveTask;

            this.taskStatusIconPath = this.$params.pathsToIcons.inProgressStatus;
            this.taskStatusIconPathFallback = this.$params.pathsToFallbackIcons.inProgressStatus;

            this.showModalButton = !!this.modalButtonParams;
        }

        this.progressDetails = `${this.task.progressCurrent} / ${this.task.progressTotal}`;
    }

    public openDescription(): void {
        this.modalService.showModal('questTaskInfo', {task: this.task});
    }

    protected prepareModalButtonParams(): void {
        if (this.$params.modalButtonParams) {
            if (this.task.progressTarget in this.$params.modalButtonParams) {
                this.modalButtonParams = this.$params.modalButtonParams[this.task.progressTarget];
            } else if (this.task.actionUrl && this.task.actionTitle) {
                this.modalButtonParams = this.$params.modalButtonParams.Empty;
            } else {
                this.modalButtonParams = null;
            }
        }

        if (this.modalButtonParams) {
            if (this.task.actionTitle) {
                this.modalButtonParams.common.text = this.task.actionTitle;
            }

            if (this.task.actionUrl) {
                this.modalButtonParams.common.sref = null;
                this.modalButtonParams.common.href = '/' + QuestTaskModel.currentLang +
                    (this.task.actionUrl.startsWith('/')
                        ? this.task.actionUrl
                        : '/' + this.task.actionUrl);
                this.modalButtonParams.common.hrefTarget = '_self';
            }
        }
    }
}
