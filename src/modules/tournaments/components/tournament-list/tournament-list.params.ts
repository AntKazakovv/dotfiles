import {
    CustomType,
    IButtonCParams,
    IComponentParams,
    IPagination,
} from 'wlc-engine/modules/core';
import {RestType, ThumbType} from 'wlc-engine/modules/tournaments';
import {SwiperOptions} from 'swiper';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';

export type ComponentTheme = 'default' | 'dashboard' | 'active' | 'available' | 'banner' | 'detail' | CustomType;
export type ComponentType = 'default' | 'swiper' | CustomType;
export type ThemeMod = 'default' | CustomMod;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TournamentsListNoContentByThemeType = Partial<Record<ComponentTheme, INoContentCParams>>;

export interface ITournamentListCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customMod?: CustomMod;
        restType?: RestType;
        thumbType?: ThumbType;
        swiper?: SwiperOptions;
        pagination?: IPagination;
    },
    useNoTournamentsBtn?: boolean;
    noTournamentsBtn?: IButtonCParams,
    noContent?: TournamentsListNoContentByThemeType,
}

export const defaultParams: ITournamentListCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-list',
    componentName: 'wlc-tournament-list',
    useNoTournamentsBtn: false,
    noTournamentsBtn: {
        common: {
            text: gettext('Go home'),
            sref: 'app',
        },
    },
};
