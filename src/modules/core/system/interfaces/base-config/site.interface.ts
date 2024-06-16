export interface ISiteLanguages {
    availableOnly?: string[];
}

export interface ISiteConfig {
    name: string;
    url: string;
    theme?: TThemeApp;
    removeCreds?: boolean;
    restrictRegistration?: boolean;
    /**
     * Use field username/login
     */
    useLogin?: boolean;
    /**
     * Link to the main landing page of the affiliate program.
     * Uses for action 'AFFILIATE_REDIRECT'.
     */
    landingUrl?: string,
    /** Force use Curacao requirements as for WLC */
    forceCuracaoRequirement?: boolean;
    /** Use x-nonce on requests */
    useXNonce?: boolean;
    languages?: ISiteLanguages;
    /** Use jwt token (JSON Web Token) for user authorization */
    useJwtToken?: boolean;
    /** Сustom gstatic url on the project */
    gstaticUrl?: string;
}

export type TThemeApp = 'wolf';
