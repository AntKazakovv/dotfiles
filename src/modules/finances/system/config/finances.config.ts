import {IFinancesConfig} from '../interfaces/finances.interface';

export const financesConfig: IFinancesConfig = {
    fastDeposit: {
        gamePlayShowLimit: 3,
    },
    paymentInfo: {
        autoScroll: false,
        hiddenPaymentInfo: false,
    },
    paySystemCategories: {
        dropdownBefore: '(max-width: 479px)',
        useFor: 'deposit',
        categoriesConfig: {
            recommended: {
                name: gettext('Recommended'),
                order: 20,
            },
            card_method: {
                name: gettext('Bank Cards'),
                order: 16,
            },
            e_wallet: {
                name: gettext('E-Wallets'),
                order: 12,
            },
            crypto: {
                name: gettext('Cryptocurrencies'),
                order: 8,
            },
            buy_crypto: {
                name: gettext('Buy Crypto'),
                order: 6,
            },
            direct_banking: {
                name: gettext('Bank Transfer'),
                order: 4,
            },
            other: {
                name: gettext('Other'),
                order: 0,
            },
        },
    },
    fieldsSettings: {
        additional: {
            withdraw_account: {
                default: {
                    validators: [
                        {
                            name: 'pattern',
                            options: '^[a-zA-Z0-9:]*$',
                            text: gettext('The cryptocurrency wallet address is incorrect'),
                        },
                        {
                            name: 'minLength',
                            options: 8,
                        },
                        {
                            name: 'maxLength',
                            text: gettext('The field must be no more than 255 characters long'),
                            options: 255,
                        },
                    ],
                },
                settings: [
                    {
                        validators: [
                            {
                                name: 'pattern',
                                options: '^.*$',
                            },
                        ],
                        systems: ['mifinity_acct2acct'],
                    },
                ],
            },
            accountNumber: {
                settings: [
                    {
                        tooltip: gettext('Please combine the 5 digit Branch number e.g.' +
                            ' “27370” with the 3 digit Financial institution number e.g. “001” ;' +
                            ' and the account number digit Account number e.g. “91011112”,' +
                            ' then you send to Inpay “273700019101112”. Please do not use Dash.'),
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                            {
                                name: 'minLength',
                                options: 15,
                            },
                            {
                                name: 'maxLength',
                                options: 15,
                            },
                        ],
                        countries: ['can'],
                        systems: ['inpay_withdraw'],
                    },
                    {
                        tooltip: gettext('Please combine branch code/BSB with the 7 account number and' +
                            ' 3 digit suffix. E.g. 6 digit BSB e.g. “020432”, Account number “6781299”,' +
                            ' Suffix “001” then you send to Inpay “0204326781299001”. Please do not use Dash.'),
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                            {
                                name: 'minLength',
                                options: 15,
                            },
                            {
                                name: 'maxLength',
                                options: 16,
                            },
                        ],
                        countries: ['nzl'],
                        systems: ['inpay_withdraw'],
                    },
                    {
                        tooltip: gettext('Please enter 11 digit numbers of CPF from RG ID card.' +
                            ' Please do not use Dash.'),
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                            {
                                name: 'minLength',
                                options: 11,
                            },
                            {
                                name: 'maxLength',
                                options: 11,
                            },
                        ],
                        countries: ['bra'],
                        systems: ['pagsmile_brazil'],
                    },
                ],
            },
            phone: {
                settings: [
                    {
                        tooltip: gettext('Phone number format: 79111111111'),
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                            {
                                name: 'minLength',
                                options: 11,
                            },
                            {
                                name: 'maxLength',
                                options: 11,
                            },
                        ],
                        systems: ['paycos_k3_mobile_commerce'],
                    },
                ],
            },
            otp: {
                settings: [
                    {
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                        ],
                        systems: ['paycos_k3_mobile_commerce'],
                    },
                ],
            },
            ifsc: {
                settings: [
                    {
                        validators: [
                            {
                                name: 'minLength',
                                options: 11,
                            },
                            {
                                name: 'maxLength',
                                options: 11,
                            },
                        ],
                        systems: ['runpay'],
                    },
                ],
            },
            wallet_address: {
                settings: [
                    {
                        validators: [
                            {
                                name: 'maxLength',
                                options: 60,
                            },
                        ],
                        systems: ['coinspaid_cardano'],
                    },
                ],
            },
        },
    },
    transactionHistoryAlert: {
        show: false,
        title: gettext('Didn\'t receive a deposit?'),
        text: gettext('On average, a deposit can be received up to 15 minutes, ' +
            'if funds are not credited to your balance during this period, be ' +
            'sure to write to the support chat.'),
    },
    alerts: {
        deposit: {
            'activeBonusNotStackable': {
                title: gettext('You currently have one or several active bonuses. ' +
                    'A new bonus may not allow stacking with active bonuses. ' +
                    'Please check if the new bonus is available (in the bonus details). ' +
                    'If the new bonus does not allow stacking, you have to cancel or wager the active bonuses'),
                description: '',
                mod: 'warning',
            },
            'activeBonusNonCancelable': {
                title: gettext('You have one or several active bonuses which do not allow cancellation. ' +
                    'You need to wager the active bonuses to claim a new one'),
                description: '',
                mod: 'warning',
            },
        },
    },
    payLoaderPageGenerateFn: (title: string): string => {
        return `<html lang='en'>
            <head>
                <link rel="stylesheet" href="/static/css/app.loader.css">
                <title>${title}</title>
            </head>
            <body>
                <div class="wlc-app__preload">
                    <div class="wlc-app__preload-content">
                        <div class="wlc-app__preload-img"></div>
                        <div class="wlc-app__preload-loader"></div>
                    </div>
                </div>
            </body>
        </html>`;
    },
};
