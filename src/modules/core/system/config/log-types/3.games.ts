import {ILogTypes} from 'wlc-engine/modules/core/system/config/log-types';

export const errorTypes: ILogTypes = {
    '3.0.0': {
        // Error when get games catalog
    },
    '3.0.1': {
        // Game not found
    },
    '3.0.2': {
        // Error on get launch parameters
    },
    '3.0.3': {
        // Timeout on get launch parameters
    },
    '3.0.4': {
        // The game does not exist or the game settings are incorrect
    },
    '3.0.5': {
        // Error on checkMobileLaunch (FAKESID)
    },
    '3.0.6': {
        // No game iframe after timeout
    },
    '3.0.7': {
        // No game redirect after timeout
    },
    '3.0.8': {
        // Error start game script
    },
    '3.0.9': {
        // Error: mobile iframe with game not opened
    },
    '3.0.10': {
        // Mobile iframe with game timeout
    },
    '3.0.11': {
        // Timeout when get games catalog
    },
    '3.0.12': {
        // Timeout when get favorites games
    },
    '3.0.13': {
        // Error when get favorites games
    },
    '3.0.14': {
        // Timeout when add/remove favorites games
    },
    '3.0.15': {
        // Error when add/remove favorites games
    },
    '3.0.16': {
        // Error when get last played games
    },
    '3.0.17': {
        // Timeout when get last played games
    },
    '3.0.18': {
        // No sportsbook iframe after timeout
        level: 'fatal',
    },
    '3.0.19': {
        // Sportsbook starting
        level: 'info',
    },
    '3.0.20': {
        // Wrong games category slug when games is sorted
    },
    '3.0.21': {
        // No games in category or merchant
    },
    '3.0.22': {
        // Catalog has game with no CategoryID
    },
    '3.0.23': {
        // Error on adding winner slide
    },
    '3.0.24': {
        // Games list is empty
        level: 'fatal',
    },
    '3.0.25': {
        // Error when get games list
        level: 'fatal',
    },
    '3.0.26': {
        // Checks before starting the game failed
        level: 'error',
    },
    '3.0.27': {
        // Duration of checks before starting the game
        level: 'log',
        threshold: 2,
    },
    '3.0.28': {
        // User did not wait for the end of the game checks before run
        level: 'log',
    },
    '3.0.29': {
        // User try run game
        level: 'log',
    },
};
