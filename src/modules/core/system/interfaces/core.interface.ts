import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {StateParams} from '@uirouter/core/lib/params/stateParams';

export interface ICoreConfig {
}

export interface IRedirectConfig {
    /**
     * redirect by registration complete
     */
    registration?: IRedirect;
    /**
     * redirect on zero balance on enter game play
     */
    zeroBalance?: IRedirect;
    /**
     * redirect by state name
     */
    states?: IIndexing<IRedirect>;
}

export interface IRedirect {
    state: string;
    params?: IIndexing<any>;
}

export interface ISocketsData {
    api: string;
    server: string;
    token: string;
}
