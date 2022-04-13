export interface IProfileConfig {
    /**
     * Internal mails
     */
    messages?: {
        /**
         * Activate internal mails
         */
        use: boolean;
    },
    smsVerification?: {
        /**
         * Use sms verification in registration
         */
        use?: boolean,
        /**
         * Use sms verification in profile
         */
        useInProfile?: boolean;
    },
    verification?: IVerification,
    limitations?: {
        use: boolean;
    },
    store?: {
        use: boolean;
        /**
         * Use Loyalty only, without Market/Store
         */
        singleLevels?: boolean;
    },
    referrals?: {
        use: boolean;
    },
    dashboard?: {
        use: boolean;
    },
    bonuses?: {
        system?: {
            use: boolean;
        },
        inventory?: {
            use: boolean;
        },
    },
    wallet?: {
        use: boolean;
    },
    socials?: {
        use: boolean;
        usePage?: boolean;
    },
    type?: ProfileType,
    /**
     * Minimum age for the players, by default 18 years;
     */
    legalAge?: number,
    /**
     * For change difficult password.
     * Need to change also back config $cfg['PasswordSecureLevel'] value show to wiki
     */
    passwordValidation?: IPasswordValidation,
}

export interface IVerification {
    use: boolean;
    selectModeFrom: number;
    maxDocsCount: number;
    maxSize: number;
}

export interface IPasswordValidation {
    use: boolean;
    rules: IValidationPasswordRules;
}

export interface IValidationPasswordRules {
    minLength?: number;
    maxLength?: number;
}

export type ProfileType = 'default' | 'first';
