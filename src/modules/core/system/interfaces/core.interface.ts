import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {StateParams} from '@uirouter/core/lib/params/stateParams';

export interface ICoreConfig {
    redirects: IIndexing<IRedirect>,
}

export interface IRedirect {
    state: string;
    params?: StateParams;
}
