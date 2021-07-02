import {IComponentParams, CustomType} from 'wlc-engine/modules/core';
import {Tournament} from 'wlc-engine/modules/tournaments';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITournamentTopwinsBtnParams extends IComponentParams<Theme, Type, ThemeMod> {
    tournament?: Tournament;
    limit?: number;
}

export const defaultParams: ITournamentTopwinsBtnParams = {
    class: 'wlc-tournament-topwins-btn',
    limit: 10,
};
