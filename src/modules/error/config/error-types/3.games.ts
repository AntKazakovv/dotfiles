import {IErrorTypes} from 'wlc-engine/modules/error/config/error-types';

export const errorTypes: IErrorTypes = {
    '3.0.0': {
        description: 'Error when get games catalog',
        name: 'Games catalog error',
        type: 'Games_catalog_error',
    },
    '3.0.1': {
        description: 'Game not found',
        name: 'Game not found',
        type: 'game_not_found',
    },
    '3.0.2': {
        description: 'Error on get launch parameters',
        name: 'Error get launch params',
        type: 'error_get_launch_params',
    },
    '3.0.3': {
        description: 'Timeout on get launch parameters',
        name: 'Timeout get launch params',
        type: 'timeout_get_launch_params',
    },
    '3.0.4': {
        description: 'The game does not exist or the game settings are incorrect',
        name: 'Game not found',
        type: 'game_not_found',
    },
    '3.0.5': {
        description: 'Error on checkMobileLaunch (FAKESID)',
        name: 'Error on checkMobileLaunch',
        type: 'error_on_checkMobileLaunch',
    },
    '3.0.6': {
        description: 'No game iframe after timeout',
        name: 'No game iframe',
        type: 'No_game_iframe',
    },
    '3.0.7': {
        description: 'No game redirect after timeout',
        name: 'No game redirect',
        type: 'No_game_redirect',
    },
    '3.0.8': {
        description: 'Error start game script',
        name: 'Game script error',
        type: 'game_script_error',
    },
    '3.0.9': {
        description: 'Error: mobile iframe with game not opened',
        name: 'Mobile iframe error',
        type: 'mobile_iframe_error',
    },
    '3.0.10': {
        description: 'Mobile iframe with game timeout',
        name: 'Mobile iframe timeout',
        type: 'mobile_iframe_timeout',
    },
    '3.0.11': {
        description: 'Timeout when get games catalog',
        name: 'Games catalog timeout',
        type: 'Games_catalog_timeout',
    },
    '3.0.12': {
        description: 'Timeout when get favorites games',
        name: 'Favorites games timeout',
        type: 'favorites_games_timeout',
    },
    '3.0.13': {
        description: 'Error when get favorites games',
        name: 'Favorites games error',
        type: 'favorites_games_error',
    },
    '3.0.14': {
        description: 'Timeout when add/remove favorites games',
        name: 'Favorites games timeout',
        type: 'favorites_games_timeout',
    },
    '3.0.15': {
        description: 'Error when add/remove favorites games',
        name: 'Favorites games error',
        type: 'favorites_games_error',
    },
    '3.0.16': {
        description: 'Error when get last played games',
        name: 'Last played games error',
        type: 'last_played_games_error',
    },
    '3.0.17': {
        description: 'Timeout when get last played games',
        name: 'Last played games timeout',
        type: 'last_played_games_timeout',
    },
    '3.0.18': {
        description: 'No sportsbook iframe after timeout',
        name: 'No sportsbook iframe',
        type: 'No_sportsbook_iframe',
        level: 'fatal',
    },
    '3.0.19': {
        description: 'Sportsbook starting',
        name: 'Sportsbook starting',
        type: 'log_sportsbook_starting',
        level: 'info',
    },
    '3.0.20': {
        description: 'Wrong games category slug when games is sorted',
        name: 'Wrong_category_slug',
        type: 'Wrong_category_slug',
    },
    '3.0.21': {
        description: 'No games in category or merchant',
        name: 'No_games',
        type: 'No_games',
    },
    '3.0.22': {
        description: 'Catalog has game with no CategoryID',
        name: 'No_CategoryID',
        type: 'No_CategoryID',
    },
    '3.0.23': {
        description: 'Error on adding winner slide',
        name: 'Error on adding winner slide',
        type: 'Error_on_adding_winner_slide',
    },
    '3.0.24': {
        description: 'Games list is empty',
        name: 'Games list empty',
        type: 'Games_list_empty',
        level: 'fatal',
        method: 'Both',
    },
    '3.0.25': {
        description: 'Error when get games list',
        name: 'Games list error',
        type: 'Games_list_error',
        level: 'fatal',
        method: 'Both',
    },
    '3.0.26': {
        description: 'Checks before starting the game failed',
        name: 'Games checkOnRun failed',
        type: 'Games_checkOnRun_failed',
        level: 'error',
        method: 'Flog',
    },
    '3.0.27': {
        description: 'Duration of checks before starting the game',
        name: 'Games checkOnRun duration',
        type: 'Games_checkOnRun_duration',
        level: 'log',
        method: 'Flog',
        threshold: 2
    },
    '3.0.28': {
        description: 'User did not wait for the end of the game checks before run',
        name: 'Games checkOnRun aborted by user',
        type: 'Games_checkOnRun_aborted_by_user',
        level: 'log',
        method: 'Flog',
    },
    '3.0.29': {
        description: 'User try run game',
        name: 'Attempt to run game',
        type: 'Attempt_to_run_game',
        level: 'log',
        method: 'Flog',
    },
};
