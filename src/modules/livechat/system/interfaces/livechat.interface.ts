import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface ILivechatConfig {
    type?: TLiveChat;
    code?: string;
    onlyProd?: boolean;
    hidden?: boolean;
    setUserDetails?: boolean; // livechatinc set user email and name to chat
    chatraSetup?: any;
    group?: IIndexing<string>; // chatra language groups
}

export type TLiveChat = 'chatra' | 'livechatinc';
