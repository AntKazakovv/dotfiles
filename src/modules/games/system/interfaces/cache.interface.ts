export interface ICacheSettings {
    /**
     * Settings for search games
     */
    searchGames: {
        /**
         * Count of remembered queries
         */
        chipsCount?: number;
        /**
         * Saving time queries list
         */
        saveTime?: number;
    };
}
