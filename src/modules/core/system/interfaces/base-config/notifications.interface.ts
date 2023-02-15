export interface IBreakpoints {
    [breakpoint: number]: number;
}

export interface INotificationsConfig {

    useModals?: boolean;
    /**
     * @description
     *
     * Defines notification thread z-index
     *
     * @default 1200
     */
    zIndex?: number;

    /**
     * @description
     *
     * Record that determines number of notifications that
     * could be shown at once
     *
     * Key stands for min-width and value for notifications amount
     *
     * @example
     * ```typescript
     * {
     *   900: 3, // show 3 notifications at max on screen wider then 900px
     * }
     * ```
     *
     * @default
     * ```typescript
     * {
     *   0: 1,
     *   900: 2,
     *   1200: 3,
     *   1680: 4,
     * }
     * ```
     */
    notificationsPerBreakpoint?: IBreakpoints;

        /**
     * Default dismiss time in ms
     *
     * @default 15000
     */
    defaultDismissTime?: number;
}
