import {IComponentParams} from 'wlc-engine/interfaces/config.interface';
import {IIconParams} from 'wlc-engine/modules/base/models/icon-list-item.model';

export type ListType = 'merchants' | 'payments' | 'custom';
export type ListTheme = 'default' | 'svg';
export type IconsColor = 'default' | 'white' | 'black' | 'colored';

export interface IParams extends IComponentParams<ListTheme, ListType, string> {
    common?: {
        iconsColor?: IconsColor;
    }
    items?: IIconParams[];
}

export const defaultParams: IParams = {
    class: 'wlc-icon-list',
    common: {
        iconsColor: 'white',
    },
};


// TODO delete after service
export interface IPayment {
    alias: string;
    image: string;
    id: string;
    image_withdraw: string;
    name: string;
    name_withdraw: string;
    [key: string]: any;
};
export const PAYMENTS = [{
    'id': '22',
    'name': 'Neteller',
    'name_withdraw': 'Neteller',
    'description': '',
    'description_withdraw': '',
    'additional': 'firstName%5Blabel%5D=Firstname&firstName%5Bshowfor%5D=deposit&lastName%5Blabel%5D=Lastname&lastName%5Bshowfor%5D=deposit&net_account%5Blabel%5D=Acount+ID&net_account%5Bskipsaving%5D=1&net_account%5Bshowfor%5D=deposit&secure_id%5Blabel%5D=Secure+ID&secure_id%5Bskipsaving%5D=1&secure_id%5Bshowfor%5D=deposit',
    'showfor': 'All',
    'image': 'https:\/\/static.egamings.com\/paysystems\/neteller.png',
    'image_withdraw': 'https:\/\/static.egamings.com\/paysystems\/neteller.png',
    'alias': 'neteller',
    'required': [],
    'disable_amount': false,
    'message': '',
    'allowiframe': 0,
    'appearance': 'replace',
    'lastAccounts': [],
    'hostedFields': [],
    'additionalParams': {
        'firstName': {
            'label': 'Firstname',
            'showfor': 'deposit'
        },
        'lastName': {
            'label': 'Lastname',
            'showfor': 'deposit'
        },
        'net_account': {
            'label': 'Acount ID',
            'skipsaving': '1',
            'showfor': 'deposit'
        },
        'secure_id': {
            'label': 'Secure ID',
            'skipsaving': '1',
            'showfor': 'deposit'
        }
    }
}, {
    'id': '62',
    'name': 'PayCryptos Bitcoin',
    'name_withdraw': 'PayCryptos Bitcoin',
    'description': '',
    'description_withdraw': '',
    'additional': 'withdraw_account%5Blabel%5D=Withdraw+Address&withdraw_account%5Bshowfor%5D=deposit',
    'showfor': 'All',
    'image': 'https:\/\/static.egamings.com\/paysystems\/cryptspay.png',
    'image_withdraw': 'https:\/\/static.egamings.com\/paysystems\/cryptspay.png',
    'alias': 'paycryptos_bitcoin',
    'required': [],
    'disable_amount': false,
    'message': '',
    'allowiframe': 0,
    'appearance': 'replace',
    'lastAccounts': [],
    'hostedFields': [],
    'additionalParams': {
        'withdraw_account': {
            'label': 'Withdraw Address',
            'showfor': 'deposit'
        }
    }
}, {
    'id': '63',
    'name': 'PayCryptos Ethereum',
    'name_withdraw': 'PayCryptos Ethereum',
    'description': '',
    'description_withdraw': '',
    'additional': 'withdraw_account%5Blabel%5D=Withdraw+Address&withdraw_account%5Bshowfor%5D=deposit',
    'showfor': 'All',
    'image': 'https:\/\/static.egamings.com\/paysystems\/cryptspay.png',
    'image_withdraw': 'https:\/\/static.egamings.com\/paysystems\/cryptspay.png',
    'alias': 'paycryptos_ethereum',
    'required': [],
    'disable_amount': false,
    'message': '',
    'allowiframe': 0,
    'appearance': 'replace',
    'lastAccounts': [],
    'hostedFields': [],
    'additionalParams': {
        'withdraw_account': {
            'label': 'Withdraw Address',
            'showfor': 'deposit'
        }
    }
}, {
    'id': '19',
    'name': 'Skrill',
    'name_withdraw': 'Skrill',
    'description': '',
    'description_withdraw': '',
    'additional': '',
    'showfor': 'All',
    'image': 'https:\/\/static.egamings.com\/paysystems\/moneybookers.png',
    'image_withdraw': 'https:\/\/static.egamings.com\/paysystems\/moneybookers.png',
    'alias': 'skrill',
    'required': [],
    'disable_amount': false,
    'message': '',
    'allowiframe': 0,
    'appearance': 'replace',
    'lastAccounts': [],
    'hostedFields': [],
    'additionalParams': []
}, {
    'id': '29',
    'name': 'Visa\/Mastercard',
    'name_withdraw': 'Visa\/Mastercard',
    'description': '',
    'description_withdraw': '',
    'additional': '',
    'showfor': 'All',
    'image': 'https:\/\/static.egamings.com\/paysystems\/airpay.png',
    'image_withdraw': 'https:\/\/static.egamings.com\/paysystems\/airpay.png',
    'alias': 'visa_mastercard',
    'required': [],
    'disable_amount': false,
    'message': '',
    'allowiframe': 0,
    'appearance': 'replace',
    'lastAccounts': [],
    'hostedFields': [],
    'additionalParams': []
}, {
    'id': '8',
    'name': 'Webmoney',
    'name_withdraw': 'Webmoney',
    'description': '',
    'description_withdraw': '',
    'additional': '',
    'showfor': 'All',
    'image': 'https:\/\/static.egamings.com\/paysystems\/wm.png',
    'image_withdraw': 'https:\/\/static.egamings.com\/paysystems\/wm.png',
    'alias': 'webmoney',
    'required': [],
    'disable_amount': false,
    'message': '',
    'allowiframe': 0,
    'appearance': 'replace',
    'lastAccounts': [],
    'hostedFields': [],
    'additionalParams': []
}, {
    'id': '31',
    'name': 'Wirecard',
    'name_withdraw': 'Wirecard',
    'description': '',
    'description_withdraw': '',
    'additional': '',
    'showfor': 'All',
    'image': 'https:\/\/static.egamings.com\/paysystems\/wirecard.png',
    'image_withdraw': 'https:\/\/static.egamings.com\/paysystems\/wirecard.png',
    'alias': 'wirecard',
    'required': [],
    'disable_amount': false,
    'message': '',
    'allowiframe': 0,
    'appearance': 'replace',
    'lastAccounts': [],
    'hostedFields': [],
    'additionalParams': []
}];
