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
                            text: gettext('The field cannot contain more than 255 characters'),
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
                        tooltip: gettext('Combine 5 digits of your branch number, e.g., 11111, with the 3-digit' +
                            ' number of your financial institution number, e.g., 222, and the digits' +
                            ' of your account number, e.g., 33333333. The sequence you should' +
                            ' send to Inpay would be: 1111122233333333. Please do not use a dash.'),
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
                        tooltip: gettext('Combine the branch code/BSB with 7 digits of your account number and' +
                            ' 3 digits of the suffix. E.g., your BSB is 111111, the account number is 2222222,' +
                            ' the suffix is 333. The sequence you should send to' +
                            ' Inpay would be: 1111112222222333. Please do not use a dash.'),
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
                        tooltip: gettext('Please enter the 11-digit number of the CPF from your RG ID card.' +
                            ' Please do not use a dash'),
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
                        tooltip: gettext('Phone number format: 70000000000'),
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
        text: gettext('On average, the deposit is credited within 15 minutes. ' +
            'If funds are not credited to your balance during this period, ' +
            'please contact the technical support of our casino'),
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
