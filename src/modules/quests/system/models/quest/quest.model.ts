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

    public updateData(newData: Partial<IQuest> | IQuest): void {
        this.data = {
            ...(this.data ?? {}),
            ...newData,
        } as IQuest;
        this.id = this.data.ID.toString();
        this.name = this.getCurrentLangText(this.data.Name);
        this._statuses = {
            NOT_COMPLETED: this.data.Status === QuestStatusEnum.NOT_COMPLETED,
            COMPLETED: this.data.Status === QuestStatusEnum.COMPLETED,
            OPENED: this.data.Status === QuestStatusEnum.OPENED,
            FINISHED: this.data.Status === QuestStatusEnum.FINISHED,
        };
        this.progressPercent = Math.floor(this.progressReady * 100 / (this.progressTotal || 1));
    }

    public get renewalTime(): Dayjs {
        return dayjs(this.data.RenewalTime);
    }

    public get bonusTakenAt(): string {
        return this.data.BonusTakenAt;
    }

    public get status(): QuestStatusEnum {
        return this.data.Status;
    }

    public get idBonus(): number {
        return this.data.IDBonus;
    }

    public get progressTotal(): number {
        return this.data.Progress.Total;
    }

    public get progressReady(): number   {
        return this.data.Progress.Ready;
    }

    public get rewardedBonusId(): number {
        return this.data.Progress.Bonus;
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
