import {ILogTypes} from './index';

export const errorTypes: ILogTypes = {
    '1.1.0': {
        // User registration error
    },
    '1.1.1': {
        // User registration error: modal opened timeout
        level: 'fatal',
    },
    '1.1.2': {
        // No bonuses from fundist on registration
        level: 'warning',
    },
    '1.1.3': {
        // Timeout when get bonuses on registration
    },
    '1.1.4': {
        // Error when getting bonuses on registration
    },
    '1.1.5': {
        // Timeout when validate signup form
    },
    '1.1.6': {
        // Timeout when create user profile
    },
    '1.1.7': {
        // Error while creating user profile on singup
        level: 'fatal',
    },
    '1.1.8': {
        // SMS send timeout
    },
    '1.1.9': {
        // Error occurred while sending code for SMS Verification
        level: 'fatal',
    },
    '1.1.10': {
        // Error occurred while checking SMS status
    },
    '1.1.11': {
        // SMS validate timeout
    },
    '1.1.12': {
        // Error occured during code validation
    },
    '1.1.13': {
        // Error when validate signup form
    },
    '1.1.14': {
        // Timeout while checking SMS status
    },
    '1.1.15': {
        // Timeout while getting coutries
    },
    '1.1.16': {
        // Error while getting countries
    },
    '1.1.17': {
        // Empty result while getting countries
    },
    '1.1.18': {
        // Registration complete timeout
    },
    '1.1.19': {
        // Registration complete error
        level: 'fatal',
    },
    '1.1.20': {
        // User error while creating user profile on singup
        level: 'warning',
    },
    '1.1.21': {
        // User error occurred while sending code for SMS Verification
        level: 'warning',
    },
    '1.1.22': {
        // Registration complete warning (may be user double click)
        level: 'warning',
    },
    '1.1.23': {
        // Sing up request return 4xx
    },
    '1.1.24': {
        // Sing up request return 5xx
        level: 'fatal',
    },
    '1.1.25': {
        // Sing up request send
        level: 'info',
    },
    '1.1.26': {
        // Error during partly profile saving
    },
    '1.1.27': {
        // Error login after fastRegistration
    },
    '1.1.28': {
        // Successful login after fastRegistration
    },
    '1.1.29': {
        // Successful login after confirm email Link
    },
    '1.1.30': {
        // Error login after confirm email Link
    },
    '1.2.0': {
        // User login error
    },
    '1.2.1': {
        // User login error: modal opened timeout
        level: 'fatal',
    },
    '1.2.2': {
        // User login timeout
    },
    '1.2.3': {
        // Login request return 4xx
    },
    '1.2.4': {
        // Login request return 5xx
        level: 'fatal',
    },
    '1.2.5': {
        // Login request send
        level: 'info',
    },
    '1.3.1': {
        // Captcha load timeout
    },
    '1.3.2': {
        // Captcha error
    },
    '1.3.3': {
        // Get UserInfo error
        level: 'fatal',
    },
    '1.4.0': {
        // Icon-list image error
    },
    '1.4.1': {
        // Timeout when get bonuses on deposit/withdraw
    },
    '1.4.2': {
        // Error when getting bonuses on deposit/withdraw
    },
    '1.4.3': {
        // No bonuses from fundist on deposit/withdraw
        level: 'warning',
    },
    '1.4.4': {
        // Timeout when get bonus info on deposit/withdraw
    },
    '1.4.5': {
        // Error when getting bonusinfo on deposit/withdraw
    },
    '1.4.6': {
        // Timeout getting payment systems
    },
    '1.4.7': {
        // Error getting payment systems
        level: 'fatal',
    },
    '1.4.8': {
        // Get empty payment systems list
        level: 'fatal',
    },
    '1.4.9': {
        // Timeout when update profile on deposit/withdraw
    },
    '1.4.10': {
        // Error when update profile on deposit/withdraw
        level: 'fatal',
    },
    '1.4.11': {
        // User do noting and go away
    },
    '1.4.12': {
        // Timeout when dialog load on deposit/withdraw
    },
    '1.4.13': {
        // Timeout on deposit
    },
    '1.4.14': {
        // Error on deposit
        level: 'fatal',
    },
    '1.4.15': {
        // Timeout on withdraw
    },
    '1.4.16': {
        // Error on withdraw
    },
    '1.4.17': {
        // Payment fail
        level: 'warning',
    },
    '1.4.18': {
        // Payment image not load
    },
    '1.4.19': {
        // Timeout when get transaction list
    },
    '1.4.20': {
        // Error when get transaction list
    },
    '1.4.21': {
        // Bonus unsubscribe timeout on deposit/withdraw
    },
    '1.4.22': {
        // Bonus unsubscribe error on deposit/withdraw
    },
    '1.4.23': {
        // Bonus subscribe timeout on deposit/withdraw
    },
    '1.4.24': {
        // Bonus subscribe error on deposit/withdraw
    },
    '1.4.25': {
        // Update user profile timeout subscribe timeout on check profile in deposit/withdraw
    },
    '1.4.26': {
        // Update user profile timeout subscribe error on check profile in deposit/withdraw
    },
    '1.4.27': {
        // getWithdrawQueries timeout in deposit/withdraw
    },
    '1.4.28': {
        // getWithdrawQueries error in deposit/withdraw
    },
    '1.4.29': {
        // Error in deposit limits
        level: 'warning',
    },
    '1.4.30': {
        // Deposit request start
        level: 'info',
    },
    '1.4.31': {
        // Payment success
        level: 'info',
    },
    '1.4.32': {
        // Error on deposit
        level: 'warning',
    },
    '1.4.33': {
        // User error on deposit
        level: 'info',
    },
    '1.4.34': {
        // Empty payment markup
        level: 'warning',
    },
    '1.4.35': {
        // Error loading hosted fields styles file
    },
    '1.4.36': {
        // Error loading PIQ Cashier
    },
    '1.4.37': {
        // Error when withdrawal not confirm
    },
    '1.4.41': {
        // Required field template doesn't exist
    },
    '1.5.0': {
        // Error getting social oauth url error
    },
    '1.5.1': {
        // Error getting list of social systems connected for user
    },
    '1.5.2': {
        // Error disconnect social provider to existing account
    },
    '1.5.3': {
        // Error registering user via social network
    },
    '1.5.4': {
        // Wrong social data, abort social registration
    },
    '1.6.0': {
        // Error during getting recaptcha token
        level: 'fatal',
    },
    '1.7.0': {
        // Auth via MetaMask error
        level: 'error',
    },
};
