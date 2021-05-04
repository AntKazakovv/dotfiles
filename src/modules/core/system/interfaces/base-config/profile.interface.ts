export interface IProfileConfig {
    messages?: {
        use: boolean;
    },
    verification?: {
        use: boolean;
    },
    limitations?: {
        use: boolean;
    },
    store?: {
        use: boolean;
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
    type?: ProfileType,
}

export type ProfileType = 'default' | 'first';
