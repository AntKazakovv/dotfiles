import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {RestType, ThumbType} from '../../system/interfaces/tournaments.interface';
import {SwiperOptions} from 'swiper';

export type ComponentTheme = 'default' | 'dashboard' | CustomType;
export type ComponentType = 'default' | 'swiper' | CustomType;
export type ThemeMod = 'default' | CustomMod;
export type AutoModifiers = ComponentTheme| ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ITournamentListCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customMod?: CustomMod;
        restType?: RestType;
        thumbType?: ThumbType;
        sortByActive?: boolean;
        swiper?: SwiperOptions;
    };
}

export const defaultParams: ITournamentListCParams = {
    moduleName: 'tournaments',
    class: 'wlc-tournament-list',
    componentName: 'wlc-tournament-list',
};
