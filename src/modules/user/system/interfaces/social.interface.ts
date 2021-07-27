import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';

export interface ISocialData {
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
    social: string;
    social_uid: string;
}

export interface IRegisterParams {
    currency: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    promo: string;
    registrationBonus: number;
    social: string;
    social_uid: string;
}

export interface ISocialAuthUrlResponse extends IData {
    data: {
        authUrl: string;
    };
}

export interface ISocialUserDataResponse extends IData {
    data: ISocialData;
}

export interface ISocialConnectedList extends IData {
    data: string[];
}
