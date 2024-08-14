import dayjs from 'dayjs';
import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';
import _toNumber from 'lodash-es/toNumber';
import _map from 'lodash-es/map';

import {
    AbstractModel,
    IIndexing,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    IAchievement,
    IAchievementLevelInfo,
    TAchievementTarget,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';

export type TStatus = 'not-started' | 'in-progress' | 'received';
export type TAchievementLevelInfo = {
    [key in keyof IAchievementLevelInfo]: string
}

export class AchievementModel extends AbstractModel<IAchievement> {
    public static currentLang: string;
    public readonly levelsInfo!: TAchievementLevelInfo[];
    public readonly progressDetailsText!: string;
    public readonly progressPercent!: number;

    private _actionTitle: string;
    private _description: string;
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
        this._actionTitle = this.getCurrentLangText(this.data.ActionTitle);
        this.levelsInfo = _map(
            this.data.LevelsInfo,
            (info: IAchievementLevelInfo): TAchievementLevelInfo => ({
                name: this.getCurrentLangText(info.name),
                description: this.getCurrentLangText(info.description),
            }),
        );
        this.progressDetailsText = this.data.ProgressDetails.CurrentLevelDetails
            ? this.data.ProgressDetails.CurrentLevelDetails.Current +
                ' / ' + this.data.ProgressDetails.CurrentLevelDetails.Total
            : this.data.ProgressDetails.Current +
                ' / ' + this.data.ProgressDetails.Total;
        this.progressPercent = this.data.ProgressDetails.CurrentLevelDetails
            ? Math.ceil(
                _toNumber(this.data.ProgressDetails.CurrentLevelDetails.Current) *
                100 / (_toNumber(this.data.ProgressDetails.CurrentLevelDetails.Total) || 1),
            ) || 0
            : Math.ceil(
                _toNumber(this.data.ProgressDetails.Current) *
                100 / (_toNumber(this.data.ProgressDetails.Total) || 1),
            ) || 0;
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
        return dayjs(this.data.EndDate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY');
    }

    protected getCurrentLangText(property: string | IIndexing<string>): string {
        if (_isObject(property)) {
            return property[AchievementModel.currentLang] || property['en'] || '';
        }
        return property;
    }
}
