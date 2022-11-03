import {IScrollbarCParams} from 'wlc-engine/modules/core/components/scrollbar/scrollbar.params';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IDropdownSearchCParams extends IComponentParams<Type, Theme, ThemeMod> {
    /**
     * Game Grid Viewing Options
     */
    gamesGridParams?: IGamesGridCParams;
    /**
     * Scrollbar params
     */
    scrollbarParams?: IScrollbarCParams;
};

export const defaultParams: IDropdownSearchCParams = {
    moduleName: 'games',
    componentName: 'wlc-dropdown-search',
    class: 'wlc-dropdown-search',
    gamesGridParams: {
        type: 'search',
        searchFilterName: 'dropdown',
        gamesRows: 10,
        usePlaceholders: false,
        byState: false,
        showTitle: false,
        moreBtn: {
            hide: true,
            lazy: true,
        },
        noContentText: {
            default: gettext('Sorry, but nothing was found. Check the spelling or try a different name.'),
        },
        updateGridAfterFiltering: true,
        thumbParams: {
            type: 'horizontal',
            theme: 'horizontal',
        },
    },
    scrollbarParams: {
        swiperOptions: {
            scrollbar: {
                draggable: true,
                snapOnRelease: false,
            },
        },
    },
};

