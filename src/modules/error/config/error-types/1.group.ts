import {IErrorTypes} from 'wlc-engine/modules/error/config/error-types';

export const errorTypes: IErrorTypes = {
    '1.1.0': {
        description: 'User registration error',
        name: 'Signup Error',
        type: 'Signup_Error',
        group: 'Sign Up',
    },
    '1.1.1': {
        description: 'User registration error: modal opened timeout',
        name: 'SignUp opened timeout',
        type: 'Modal_opened_timeout',
        group: 'Sign Up',
    },
    '1.1.2': {
        description: 'No bonuses from fundist on registration',
        name: 'No bonuses on registration',
        type: 'No_bonuses',
        level: 'warning',
        group: 'Sign Up',
    },
    '1.1.3': {
        description: 'Timeout when get bonuses on registration',
        name: 'Get bonuses timeout',
        type: 'bonuses_timeout',
        group: 'Sign Up',
    },
    '1.1.4': {
        description: 'Error when getting bonuses on registration',
        name: 'Get bonuses error',
        type: 'bonuses_error',
        group: 'Sign Up',
    },
    '1.1.5': {
        description: 'Timeout when validate signup form',
        name: 'Form validation timeout',
        type: 'form_validation_timeout',
        group: 'Sign Up',
    },
    '1.1.6': {
        description: 'Timeout when create user profile',
        name: 'User profile creatiog timeout',
        type: 'creating_profile_timeout',
        group: 'Sign Up',
    },
    '1.1.7': {
        description: 'Error while creating user profile on singup',
        name: 'Signup Error',
        type: 'Signup_Error',
        level: 'fatal',
        group: 'Sign Up',
    },
    '1.1.8': {
        description: 'SMS send timeout',
        name: 'SMS send timeout',
        type: 'SMS_send_timeout',
        group: 'Sign Up',
    },
    '1.1.9': {
        description: 'Error occurred while sending code for SMS Verification',
        name: 'SMS send error',
        type: 'SMS_send_error',
        level: 'fatal',
        group: 'Sign Up',
    },
    '1.1.10': {
        description: 'Error occurred while checking SMS status',
        name: 'SMS check error',
        type: 'SMS_check_error',
        group: 'Sign Up',
    },
    '1.1.11': {
        description: 'SMS validate timeout',
        name: 'SMS validate timeout',
        type: 'SMS_validate_timeout',
        group: 'Sign Up',
    },
    '1.1.12': {
        description: 'Error occured during code validation',
        name: 'SMS validate error',
        type: 'SMS_validate_error',
        group: 'Sign Up',
    },
    '1.1.13': {
        description: 'Error when validate signup form',
        name: 'Form validation error',
        type: 'form_validation_error',
        group: 'Sign Up',
    },
    '1.1.14': {
        description: 'Timeout while checking SMS status',
        name: 'SMS check timeout',
        type: 'SMS_check_timeout',
        group: 'Sign Up',
    },
    '1.1.15': {
        description: 'Timeout while getting coutries',
        name: 'Get countries timeout',
        type: 'Get_countries_timeout',
        group: 'Sign Up',
    },
    '1.1.16': {
        description: 'Error while getting coutries',
        name: 'Get countries error',
        type: 'Get_countries_error',
        group: 'Sign Up',
    },
    '1.1.17': {
        description: 'Empty result while getting coutries',
        name: 'Get countries empty',
        type: 'Get_countries_empty',
        group: 'Sign Up',
    },
    '1.1.18': {
        description: 'Registration complete timeout',
        name: 'Complete signup timeout',
        type: 'Complete_signup_timeout',
        group: 'Sign Up',
    },
    '1.1.19': {
        description: 'Registration complete error',
        name: 'Complete signup error',
        type: 'Complete_signup_error',
        level: 'fatal',
        group: 'Sign Up',
    },
    '1.1.20': {
        description: 'User error while creating user profile on singup',
        name: 'Signup User Error',
        type: 'Signup_User_Error',
        level: 'warning',
        group: 'Sign Up',
    },
    '1.1.21': {
        description: 'User error occurred while sending code for SMS Verification',
        name: 'SMS send error',
        type: 'SMS_send_error',
        level: 'warning',
        group: 'Sign Up',
    },
    '1.1.22': {
        description: 'Registration complete warning (may be user double click)',
        name: 'Complete signup warning',
        type: 'Complete_signup_warning',
        level: 'warning',
        group: 'Sign Up',
    },
    '1.2.0': {
        description: 'User login error',
        name: 'Login Error',
        type: 'Login_Error'
    },
    '1.2.1': {
        description: 'User login error: modal opened timeout',
        name: 'Login opened timeout',
        type: 'Modal_opened_timeout'
    },
    '1.2.2': {
        description: 'User login timeout',
        name: 'Login timeout',
        type: 'Login_timeout'
    },
    '1.3.1': {
        description: 'Captcha load timeout',
        name: 'Captcha timeout',
        type: 'Captcha_timeout'
    },
    '1.3.2': {
        description: 'Captcha error',
        name: 'Captcha error',
        type: 'Captcha_error'
    },
    '1.3.3': {
        description: 'Get UserInfo error',
        name: 'Get UserInfo error',
        type: 'get_user_info',
        level: 'fatal',
        method: 'Both'
    },
    '1.4.1': {
        description: 'Timeout when get bonuses on deposit/withdraw',
        name: 'Get bonuses timeout',
        type: 'bonuses_timeout'
    },
    '1.4.2': {
        description: 'Error when getting bonuses on deposit/withdraw',
        name: 'Get bonuses error',
        type: 'bonuses_error'
    },
    '1.4.3': {
        description: 'No bonuses from fundist on deposit/withdraw',
        name: 'No bonuses on deposit/withdraw',
        type: 'No_bonuses',
        level: 'warning'
    },
    '1.4.4': {
        description: 'Timeout when get bonus info on deposit/withdraw',
        name: 'Get bonus info timeout',
        type: 'bonus_info_timeout'
    },
    '1.4.5': {
        description: 'Error when getting bonusinfo on deposit/withdraw',
        name: 'Get bonus info error',
        type: 'bonus_info_error'
    },
    '1.4.6': {
        description: 'Timeout getting payment systems',
        name: 'Timeout payment system',
        type: 'Timeout_payment_system'
    },
    '1.4.7': {
        description: 'Error getting payment systems',
        name: 'Error payment system',
        type: 'Error_payment_system',
        level: 'fatal',
    },
    '1.4.8': {
        description: 'Get empty payment systems list',
        name: 'Empty payment system',
        type: 'Empty_payment_system',
        level: 'fatal',
    },
    '1.4.9': {
        description: 'Timeout when update profile on deposit/withdraw',
        name: 'Timeout update profile',
        type: 'Timeout_update_profile'
    },
    '1.4.10': {
        description: 'Error when update profile on deposit/withdraw',
        name: 'Error update profile',
        type: 'Error_update_profile',
        level: 'fatal',
    },
    '1.4.11': {
        description: 'User do noting and go away',
        name: 'User has left the page',
        type: 'User_has_left'
    },
    '1.4.12': {
        description: 'Timeout when dialog load on deposit/withdraw',
        name: 'Timeout dialog load',
        type: 'Timeout_dialog_load'
    },
    '1.4.13': {
        description: 'Timeout on deposit',
        name: 'Timeout deposit',
        type: 'Timeout_deposit'
    },
    '1.4.14': {
        description: 'Error on deposit',
        name: 'Error deposit',
        type: 'Error_deposit',
        level: 'fatal',
    },
    '1.4.15': {
        description: 'Timeout on withdraw',
        name: 'Timeout withdraw',
        type: 'Timeout_withdraw'
    },
    '1.4.16': {
        description: 'Error on withdraw',
        name: 'Error withdraw',
        type: 'Error_withdraw'
    },
    '1.4.17': {
        description: 'Payment fail',
        name: 'Error payment fail',
        type: 'Error_payment_fail',
        level: 'warning',
    },
    '1.4.18': {
        description: 'Payment image not load',
        name: 'Error load payment image',
        type: 'Error_load_payment_image'
    },
    '1.4.19': {
        description: 'Timeout when get transaction list',
        name: 'Get transactions timeout',
        type: 'transactions_timeout'
    },
    '1.4.20': {
        description: 'Error when get transaction list',
        name: 'Get transactions error',
        type: 'transactions_error'
    },
    '1.4.21': {
        description: 'Bonus unsubscribe timeout on deposit/withdraw',
        name: 'Bonus unsubscribe timeout',
        type: 'Bonus_unsubscribe_timeout'
    },
    '1.4.22': {
        description: 'Bonus unsubscribe error on deposit/withdraw',
        name: 'Bonus unsubscribe error',
        type: 'Bonus_unsubscribe_error'
    },
    '1.4.23': {
        description: 'Bonus subscribe timeout on deposit/withdraw',
        name: 'Bonus subscribe timeout',
        type: 'Bonus_subscribe_timeout'
    },
    '1.4.24': {
        description: 'Bonus subscribe error on deposit/withdraw',
        name: 'Bonus subscribe error',
        type: 'Bonus_subscribe_error'
    },
    '1.4.25': {
        description: 'Update user profile timeout subscribe timeout on check profile in deposit/withdraw',
        name: 'Update user profile timeout',
        type: 'Update_user_profile_timeout'
    },
    '1.4.26': {
        description: 'Update user profile timeout subscribe error on check profile in deposit/withdraw',
        name: 'Update user profile error',
        type: 'Update_user_profile_error'
    },
    '1.4.27': {
        description: 'getWithdrawQueries timeout in deposit/withdraw',
        name: 'getWithdrawQueries timeout',
        type: 'getWithdrawQueries_timeout'
    },
    '1.4.28': {
        description: 'getWithdrawQueries error in deposit/withdraw',
        name: 'getWithdrawQueries error',
        type: 'getWithdrawQueries_error'
    },
    '1.4.29': {
        description: 'Error in deposit limits',
        name: 'Deposit limits',
        type: 'deposit_limits',
        level: 'warning',
    },
    '1.4.30': {
        description: 'Deposit request start',
        name: 'Deposit request start',
        type: 'deposit_start',
        level: 'info',
    },
    '1.4.31': {
        description: 'Payment success',
        name: 'Payment success',
        type: 'Payment_success',
        level: 'info',
    },
    '1.4.32': {
        description: 'Error on deposit',
        name: 'Error deposit',
        type: 'Error_deposit',
        level: 'warning',
    },
    '1.4.33': {
        description: 'User error on deposit',
        name: 'User error deposit',
        type: 'User_error_deposit',
        level: 'info',
    },
    '1.4.34': {
        description: 'Empty payment markup',
        name: 'Empty payment markup',
        type: 'Empty_payment_markup',
        level: 'warning',
    },
}


