import {IIndexing} from 'wlc-engine/modules/core';

export interface IUbidexConfig {
    use: boolean;
    eventsMap?: IIndexing<string[]>;
}
