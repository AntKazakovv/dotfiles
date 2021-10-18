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

export interface ILivechatConfig {
    type?: TLiveChat;
    code?: string;
    subCode?: string; // for Tawk chat
    onlyProd?: boolean;
    hidden?: boolean;
    setUserDetails?: boolean; // livechatinc set user email and name to chat
    chatraSetup?: any;
    verboxSetup?: IVerboxSetup;
    /**
     * Additional params for livechatinc.
     * https://developers.livechat.com/docs/extending-chat-widget/javascript-api/v1.0/#tracking-code
     */
    livechatincSetup?: ILivechatincSetup;
    group?: IIndexing<string>; // chatra language groups
    autocomplete?: boolean;
    zESettings?: IIndexing<any>; // https://developer.zendesk.com/api-reference/widget/settings/
    showOnlyAuth?: boolean;
    excludeStates?: string[]; // only for verbox - exclude states - chat will not shown
}

export type TLiveChat = 'chatra' | 'livechatinc' | 'verbox' | 'tawkChat' | 'zendesk';
