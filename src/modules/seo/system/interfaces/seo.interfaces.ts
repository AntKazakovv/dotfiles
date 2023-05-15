import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

export interface IState {
    name: string;
    url: string;
    params?: object;
    data?: IStateDataWithChild;
}

export interface IStateData {
    opengraph_title?: IIndexing<string>;
    opengraph_desc?: IIndexing<string>;
    opengraph_keywords?: IIndexing<string>;
    opengraph_image?: IIndexing<string>;
}

export interface IStateChild {
    page: string;
    data: IStateData;
}

export interface IStateDataWithChild extends IStateData {
    childred?: IStateChild[];
}

export interface IGameStateData extends IStateData {
    merchantID: string;
    launchCode: string;
}
