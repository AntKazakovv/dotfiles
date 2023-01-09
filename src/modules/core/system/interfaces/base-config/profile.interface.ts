import {ILimitationsConfig} from 'wlc-engine/modules/user/submodules/limitations';
import {ISmsVerification} from 'wlc-engine/modules/user/submodules/sms';

export interface ILimitationExclusion {
    type: string;
    value: number;
}

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
    smsVerification?: ISmsVerification,
    verification?: IVerification,
    limitations?: ILimitationsConfig,
    store?: {
        use: boolean;
        /**
         * Use Loyalty only, without Market/Store
         */
        singleLevels?: boolean;
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
     * Password validation settings
     * Backend site.config $cfg['PasswordSecureLevel'] settings should be applied as well
     */
    passwordValidation?: IPasswordValidation,
    /**
     * Specifies should be shown user id from Fundist or not
     */
    fundistUserId?: IFundistUserId;
}

export interface IFundistUserId {
    use: boolean;
}

export interface IVerification {
    /* A flag to enable/disable verification feature. */
    use: boolean;
    /* A flag to enable/disable Shufti Pro KYC/AML verification feature. */
    useShuftiProKycaml?: boolean;
    /* The maximum number of document types to load, after which the template with the selector will be displayed */
    selectModeFrom?: number;
    /* The maximum number of documents available for download. */
    maxDocsCount?: number;
    /* The maximum size of the uploaded file. There is also a check on the backing side */
    maxSize?: number;
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
