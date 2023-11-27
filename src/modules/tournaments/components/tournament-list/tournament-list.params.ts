import {
    CustomType,
    IButtonCParams,
    IComponentParams,
    IPagination,
} from 'wlc-engine/modules/core';
import {RestType, ThumbType} from 'wlc-engine/modules/tournaments';
import {SwiperOptions} from 'swiper';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';

export type ComponentTheme = 'default' |  'wolf' | CustomType;
export type ComponentType = 'default' | 'dashboard' | 'active' | 'available' | 'banner' | 'detail' | CustomType;
export type ThemeMod = 'default' | 'swiper' | CustomMod;
export type AutoModifiers = ComponentTheme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TournamentsListNoContentByThemeType = Partial<Record<ComponentType, INoContentCParams>>;

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
    noTournamentsBtn?: IButtonCParams;
    noContent?: TournamentsListNoContentByThemeType;
    /** is bonuses list in profile */
    inProfile?: boolean;
    isAlternative?: boolean;
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
    isAlternative: false,
};
