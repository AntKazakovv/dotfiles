/* eslint-disable no-restricted-globals */

export type TJwtAuthAction = 'login' | 'logout' | 'refresh';

/**
 * Iframe (main domain) trigger auth for mirror
 */
export interface IJwtAuth {
    event: 'JWT_AUTH';
    authToken: string | null;
    refreshToken: string | null;
    xNonce?: string | null;
}

/**
 * Iframe (main domain) trigger update tokens for mirror
 */
export interface IJwtSetTokens {
    event: 'JWT_SET_TOKENS';
    authToken: string | null;
    refreshToken: string | null;
}

/**
 * Jwt keys was changed on mirror
 */
export interface IJwtAuthUpdate {
    event: 'JWT_AUTH_UPDATE';
    action: TJwtAuthAction;
    authToken: string;
    refreshToken: string;
    xNonce?: string;
}

/**
 * XNonce was changed on mirror
 */
export interface IXNonceUpdate {
    event: 'XNONCE_UPDATE';
    xNonce: string;
}

/**
 * Mirror try get tokens from main domain (for example if we clean cache on mirror)
 */
export interface IJwtGetTokens {
    event: 'JWT_GET_TOKENS';
}

export interface IJwtAuthSync {
    event: 'JWT_AUTH_SYNC';
    authToken: string | null;
    refreshToken: string | null;
    xNonce?: string | null;
}
