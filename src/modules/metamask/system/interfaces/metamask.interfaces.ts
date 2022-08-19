import {
    IUserProfile,
    // TUserType,
} from 'wlc-engine/modules/core';

/**
 * Available actions via metamask
 * @param reg registration
 * @param login login
 * @param profile update profile
 */
export type TMetamaskMsgAction = 'reg' | 'login' | 'profile';

export type TMetamaskData = Required<Pick<IUserProfile, 'walletAddress' | 'message' | 'signature'>>;

export type TMetamaskDataReg = Required<Pick<IUserProfile, 'walletAddress' | 'message' | 'signature' | 'currency'>>;

export interface IMetamaskDepositData {
    address: string;
    contractAccount: string;
    currency: string;
    amount: string;
}
