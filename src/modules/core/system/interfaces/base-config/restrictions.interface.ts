export interface IRestrictionsConfig {
    /** Forbidden country restrict options */
    country?: {
        /** Should be blocked site displaying with showing permanent restriction modal */
        use?: boolean,
        availableOnly?: string[];
    },
}
