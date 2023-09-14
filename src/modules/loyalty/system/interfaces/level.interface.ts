import {IIndexing} from 'wlc-engine/modules/core';

export interface ILevel {
    /*
    * Level num
    * */
    Level: string,
    /*
    * Level name
    * */
    Name: string | null,
    /*
    *  Points current level
    * */
    CurrentLevelPoints?: string,
    /*
    *  Points next level
    * */
    NextLevelPoints?: string,
    /*
    * Points coefficient
    * */
    Coef: string,
    /*
    * Confirm points
    * */
    ConfirmPoints: string,
    /*
    * Level points
    * */
    Image: string | IIndexing<string> | null,
    /*
    * Level description
    * */
    Description: string | IIndexing<string> | null,
}
