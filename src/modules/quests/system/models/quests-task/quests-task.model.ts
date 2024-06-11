import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';

import {
    AbstractModel,
    IIndexing,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    IQuestTask,
    QuestTaskStatusEnum,
} from 'wlc-engine/modules/quests';

export class QuestTaskModel extends AbstractModel<IQuestTask> {
    public static currentLang: string;
    public readonly id!: string;
    public readonly questId!: string;
    public readonly name!: string;
    public readonly description!: string;
    public readonly actionTitle!: string;
    public readonly progressPercent!: number;

    constructor(
        from: IFromLog,
        data: IQuestTask,
        questId: string,
    ){
        super({from: _assign({model: 'QuestTaskModel'}, from)});

        this.data = data;
        this.questId = questId;
        this.id = this.data.ID.toString();
        this.name = this.getCurrentLangText(this.data.Name);
        this.description = this.getCurrentLangText(this.data.Description);
        this.actionTitle = this.getCurrentLangText(this.data.ActionTitle);
        this.progressPercent = Math.floor(
            this.data.ProgressDetails.Current * 100 / (this.data.ProgressDetails.Total || 1));
    }

    public get progressCurrent(): IQuestTask['ProgressDetails']['Current'] {
        return this.data.ProgressDetails.Current;
    }

    public get progressTotal(): IQuestTask['ProgressDetails']['Total'] {
        return this.data.ProgressDetails.Total;
    }

    public get progressTarget(): IQuestTask['ProgressDetails']['Target'] {
        return this.data.ProgressDetails.Target;
    }

    public get isDisabled(): boolean {
        return this.data.Status === QuestTaskStatusEnum.DISABLED;
    }

    public get imageActive(): IQuestTask['ImageActive'] {
        return this.data.ImageActive;
    }

    public get imageNotActive(): IQuestTask['ImageNotActive'] {
        return this.data.ImageNotActive;
    }

    public get actionUrl(): IQuestTask['ActionUrl'] {
        return this.data.ActionUrl;
    }

    protected getCurrentLangText(property: string | IIndexing<string>): string {
        if (_isObject(property)) {
            return property[QuestTaskModel.currentLang] || property['en'] || '';
        }
        return property;
    }
}
