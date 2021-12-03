export interface IProfileConfig {
    messages?: {
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
}

export interface IVerification {
    use: boolean;
    selectModeFrom: number;
    maxDocsCount: number;
    maxSize: number;
}

export type ProfileType = 'default' | 'first';
