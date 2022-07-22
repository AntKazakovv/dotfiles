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
    *  Points next level
    * */
    NextLevelPoints: string,
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
    Image: string | null,
    /*
    * Level description
    * */
    Description: string | null,
}
