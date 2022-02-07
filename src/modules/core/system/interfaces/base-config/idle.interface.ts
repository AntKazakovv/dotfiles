export interface IIdleConfig {
    /**
     * Message text after logout
     */
    idleMessage: string[];
    /**
     * Time of inactivity after which logout will occur
     */
    idleTime: number;
    /**
     * Time Between Activity Checks
     */
    frequencyChecks: number;
}
