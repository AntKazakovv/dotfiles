import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _isObject from 'lodash-es/isObject';

import {
    AbstractModel,
    IFromLog,
    IIndexing,
} from 'wlc-engine/modules/core';
import {
    IAchievementGroup,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';

export class AchievementGroupModel extends AbstractModel<IAchievementGroup> {
    /**
     * ID of our injected common group. Don`t change.
     * **/
    public static readonly commonGroupId: string = '-1';
    public static currentLang: string;
    public readonly name: string;

    constructor(
        from: IFromLog,
        data: IAchievementGroup,
    ){
        super({from: _assign({model: 'AchievementGroup'}, from)});
        this.data = data;
        this.name = this.getCurrentLangText(this.data.Name);
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get weight(): number {
        return _toNumber(this.data.Weight);
    }

    public get isCommon(): boolean {
        return this.data.ID === AchievementGroupModel.commonGroupId;
    }

    private getCurrentLangText(property: string | IIndexing<string>): string {
        if (_isObject(property)) {
            return property[AchievementGroupModel.currentLang] || property['en'] || '';
        }

        return property;
    }
}
