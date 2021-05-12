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
    onlyProd?: boolean;
    hidden?: boolean;
    setUserDetails?: boolean; // livechatinc set user email and name to chat
    chatraSetup?: any;
    verboxSetup?: IVerboxSetup;
    group?: IIndexing<string>; // chatra language groups
    autocomplete?: boolean;
}

export type TLiveChat = 'chatra' | 'livechatinc' | 'verbox';
