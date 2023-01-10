export interface ISmsVerification {
    /**
     * Use sms verification in registration
     */
    use?: boolean,
    /**
     * Use sms verification in profile
     */
    useInProfile?: boolean;
    /**
     * If `true` - enables restoration password through phone number
     */
    useRestorePassword?: boolean;
}
