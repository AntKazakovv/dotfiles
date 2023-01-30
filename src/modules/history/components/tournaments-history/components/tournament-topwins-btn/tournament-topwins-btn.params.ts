import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TournamentHistory} from 'wlc-engine/modules/history/system/models/tournament-history/tournament-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITournamentTopwinsBtnParams extends IComponentParams<Theme, Type, ThemeMod> {
    tournament?: TournamentHistory;
    limit?: number;
}

export const defaultParams: ITournamentTopwinsBtnParams = {
    class: 'wlc-tournament-topwins-btn',
    limit: 10,
};
