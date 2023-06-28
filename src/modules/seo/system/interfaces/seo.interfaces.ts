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

export interface IPageStateData {
    [state: string]: IStateDataWithChild;
}
export interface IStateDataWithChild extends IStateData {
    // Note: there is no mistake in the field name. The name gets from the plugin's response.
    childred?: IStateChild[];
}

export interface IGameStateData extends IStateData {
    merchantID: string;
    launchCode: string;
}
