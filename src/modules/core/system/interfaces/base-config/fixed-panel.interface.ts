export type TFixedPanelPos = 'left' | 'right';
export type TFixedPanelState = 'compact' | 'expanded' | 'closed';

export interface IFixedPanelSizes {
    /** Fixed panel width in collapsed state */
    compact?: number;
    /** Fixed panel width in expanded state */
    full?: number;
    /** Gap between fixed panel and content */
    gap?: number;
}

export interface IFixedPanelConfig {
    use?: boolean;
    /** Save or not user state to localstorage */
    position?: TFixedPanelPos;
    /** If you want show fixed panel in compact mod by default (in affiliate, for example) */
    compactModByDefault?: boolean;
    sizes?: IFixedPanelSizes;
    breakpoints?: {
        /** Breakpoint when burger panel is displaying */
        display?: number;
        /** Breakpoint when burger panel shows in expanded view */
        expand?: number;
    },
};
