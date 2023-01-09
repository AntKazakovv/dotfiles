import {ISocialItem} from 'wlc-engine/modules/core/components/social-icons/social-icons.params';

export type TimeUnits = 'hours' | 'minutes';

export interface IAdditionalInfo {
    label?: string;
    text: string;
}

export interface IContactsConfig {
    /** Phone number */
    phone?: string;
    /** Mailing address */
    email?: string;
    /** Estimated response time */
    estResTime?: number;
    /** Time units */
    timeUnits?: TimeUnits;
    /** Social media icons */
    socials?: ISocialItem[];
    /** Addidtional info */
    additionalInfo?: IAdditionalInfo;
     /** translating content by language's code */
    translate?: TContactsTranslate;
}

type lang = string;
type TranslateOptions<T> = {
    [P in keyof Omit<T, 'translate'>]: Record<lang, T[P]>
}

export type TContactsTranslate = TranslateOptions<IContactsConfig>;
