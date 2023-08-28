import {DateTime} from 'luxon';
import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';
import _toNumber from 'lodash-es/toNumber';

import {
    AbstractModel,
    IIndexing,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    IAchievement,
    TAchievementTarget,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';

export type TStatus = 'not-started' | 'in-progress' | 'received';

export class AchievementModel extends AbstractModel<IAchievement> {
    public static currentLang: string;
    private _actionTitle: string;
    private _description: string;
    private _groupName: string;
    private _name: string;
    private _prizeDescription: string;

    constructor(
        from: IFromLog,
        data: IAchievement,
    ){
        super({from: _assign({model: 'AchievementModel'}, from)});
        this.data = data;
        this._name = this.getCurrentLangText(this.data.Name);
        this._description = this.getCurrentLangText(this.data.Description);
        this._prizeDescription = this.getCurrentLangText(this.data.PrizeDescription);
        this._groupName = this.getCurrentLangText(this.data.GroupName);
        this._actionTitle = this.getCurrentLangText(this.data.ActionTitle);
    }

    public get actionTitle(): string {
        return this._actionTitle;
    }

    public get actionUrl(): string {
        return this.data.ActionUrl;
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get prizeDescription(): string {
        return this._prizeDescription;
    }

    public get groupId(): number {
        return _toNumber(this.data.IDGroup);
    }

    public get groupName(): string {
        return this._groupName;
    }

    public get isReceived(): boolean {
        return !!_toNumber(this.data.Status);
    }

    public get status(): TStatus {
        if (this.isReceived) {
            return 'received';
        } else if (this.progressPercent) {
            return 'in-progress';
        } else {
            return 'not-started';
        }
    }

    public get imageForReceived(): string {
        return this.data.ImageActive;
    }

    public get imageForNotReceived(): string {
        return this.data.ImageNotActive;
    }

    public get currentImage(): string {
        return this.isReceived ? this.imageForReceived : this.imageForNotReceived;
    }

    public get progressPercent(): number {
        return this.data.Progress ? _toNumber(this.data.Progress) : 0;
    }

    public get progressCurrent(): number {
        return this.data.ProgressDetails.Current ? _toNumber(this.data.ProgressDetails.Current) : 0;
    }

    public get progressTotal(): number {
        return this.data.ProgressDetails.Total ? _toNumber(this.data.ProgressDetails.Total) : 0;
    }

    public get progressTarget(): TAchievementTarget {
        return this.data.ProgressDetails.Target;
    }

    public get receivingDate(): string {
        return DateTime.fromSQL(this.data.EndDate).toFormat('dd.MM.yyyy');
    }

    protected getCurrentLangText(property: string | IIndexing<string>): string {
        if (_isObject(property)) {
            return property[AchievementModel.currentLang] || property['en'] || '';
        }
        return property;
    }
}
