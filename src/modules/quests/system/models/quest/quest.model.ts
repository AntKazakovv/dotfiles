import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';

import {
    AbstractModel,
    IFromLog,
    IIndexing,
} from 'wlc-engine/modules/core';
import {
    IQuest,
    QuestStatusEnum,
} from 'wlc-engine/modules/quests/system/interfaces';

export type TQuestStatuses = {[key in keyof typeof QuestStatusEnum]: boolean};

export class QuestModel extends AbstractModel<IQuest> {
    public static currentLang: string;
    public id!: string;
    public name!: string;
    public progressPercent!: number;

    private _statuses!: TQuestStatuses;

    constructor(
        from: IFromLog,
        data: IQuest,
    ){
        super({from: _assign({model: 'QuestModel'}, from)});
        this.updateData(data);
    }

    public updateData(newData: IQuest): void {
        this.data = newData;
        this.id = this.data.ID.toString();
        this.name = this.getCurrentLangText(this.data.Name);
        this._statuses = {
            NOT_COMPLETED: this.data.Status === QuestStatusEnum.NOT_COMPLETED,
            COMPLETED: this.data.Status === QuestStatusEnum.COMPLETED,
            OPENED: this.data.Status === QuestStatusEnum.OPENED,
            FINISHED: this.data.Status === QuestStatusEnum.FINISHED,
        };
        this.progressPercent = Math.floor(this.data.Progress.Ready * 100 / (this.data.Progress.Total || 1));
    }

    public get renewalTime(): Dayjs {
        return dayjs(this.data.RenewalTime);
    }

    public get status(): IQuest['Status'] {
        return this.data.Status;
    }

    public get idBonus(): IQuest['IDBonus']  {
        return this.data.IDBonus;
    }

    public get progressTotal(): IQuest['Progress']['Total']  {
        return this.data.Progress.Total;
    }

    public get progressReady(): IQuest['Progress']['Ready']   {
        return this.data.Progress.Ready;
    }

    public get isNotCompletedStatus(): boolean {
        return this._statuses.NOT_COMPLETED;
    }

    public get isCompletedStatus(): boolean {
        return this._statuses.COMPLETED;
    }

    public get isOpenedStatus(): boolean {
        return this._statuses.OPENED;
    }

    public get isFinishedStatus(): boolean {
        return this._statuses.FINISHED;
    }

    private getCurrentLangText(property: string | IIndexing<string>): string {
        if (_isObject(property)) {
            return property[QuestModel.currentLang] || property['en'] || '';
        }

        return property;
    }
}
