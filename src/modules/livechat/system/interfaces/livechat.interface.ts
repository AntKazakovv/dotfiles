import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface IVerboxSetup {
    domain?: string;
    language?: string;
    clientId?: number;
    returnMobileTriggerTimeout?: number;
}

export interface ILivechatincSetup {
    /** Chat window group (defaults to "0"). */
    group?: number;
    /** Chat session between groups. */
    chat_between_groups?: boolean;
    /** Type of Google Analytics. */
    ga_version?: 'ga' | 'gtm' | 'gtag' | 'gaq';
    /** Custom variables. */
    params?: ILivechatincCustomParams[];
}

export interface ILivechatincCustomParams {
    /** name - can be max 500 characters long. */
    name: string;
    /** value - can be max 3500 characters long. */
    value: string;
}

export type TLiveChat = 'chatra' | 'livechatinc' | 'verbox' | 'tawkChat' | 'zendesk' | 'zoho';

export type ILivechatConfig =
    | ILivechatTawkConfig
    | ILivechatChatraConfig
    | ILivechatVerboxConfig
    | ILivechatIncConfig
    | ILivechatZendeskConfig
    | ILivechatZohoConfig;


export interface ILivechatDefaultConfig {
    type: TLiveChat;
    code: string;
    onlyProd?: boolean;
    hidden?: boolean;
    showOnlyAuth?: boolean;
    excludeStates?: string[]; // exclude states - chat will not shown
}

export interface ILivechatTawkConfig
    extends ILivechatDefaultConfig {
        type: 'tawkChat';
        subCode?: string;
    }

export interface ILivechatChatraConfig
    extends ILivechatDefaultConfig {
        type: 'chatra';
        chatraSetup?: any;
        group?: IIndexing<string>; // chatra language groups
    }

export interface ILivechatVerboxConfig
    extends ILivechatDefaultConfig {
        type: 'verbox';
        autocomplete?: boolean; // true - if need complete user field (email)
        verboxSetup?: IVerboxSetup;
    }


export interface ILivechatIncConfig
    extends ILivechatDefaultConfig {
        type: 'livechatinc';
        setUserDetails?: boolean; // livechatinc set user email and name to chat
        // https://developers.livechat.com/docs/extending-chat-widget/javascript-api/v1.0/#tracking-code
        livechatincSetup?: ILivechatincSetup;
    }

export interface ILivechatZendeskConfig
    extends ILivechatDefaultConfig {
        type: 'zendesk';
        zESettings?: IIndexing<any>; // https://developer.zendesk.com/api-reference/widget/settings/
    }

export interface ILivechatZohoConfig
    extends ILivechatDefaultConfig {
        type: 'zoho';
        setUserDetails?: boolean; // if need complete user field (id)
        fundistProdLink?: string; // prod fundist link for set user details (www2.fundist.org)
    }
