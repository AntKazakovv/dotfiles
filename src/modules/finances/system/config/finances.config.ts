import {IFinancesConfig} from '../interfaces/finances.interface';

export const financesConfig: IFinancesConfig = {
    fastDeposit: {
        use: false,
    },
    paySystemCategories: {
        dropdownBefore: '(max-width: 479px)',
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
};
