export type BaseConfigType = Partial<IBaseConfig>;
export type ErrorsType = 'modals' | 'notify' | 'none';

interface IBaseConfig {
    profile: IProfile,
    tournaments: ITournaments,
    errorsType: ErrorsType;
}

export interface IProfile {
    messages?: {
        use: boolean;
    },
    verification?: {
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
}

export interface ITournaments {
    use: boolean;
}
