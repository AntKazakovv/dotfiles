import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface IVerboxSetup {
    domain?: string;
    language?: string;
    clientId?: number;
    returnMobileTriggerTimeout?: number;
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
    group?: IIndexing<string>; // chatra language groups
    autocomplete?: boolean;
    zESettings?: IIndexing<any>; // https://developer.zendesk.com/api-reference/widget/settings/
    showOnlyAuth?: boolean;
    excludeStates?: string[]; // only for verbox - exclude states - chat will not shown
}

export type TLiveChat = 'chatra' | 'livechatinc' | 'verbox' | 'tawkChat' | 'zendesk';
