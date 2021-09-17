import {ISocialItem} from 'wlc-engine/modules/core/components/social-icons/social-icons.params';

export type TimeUnits = 'hours' | 'minutes';

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
}
