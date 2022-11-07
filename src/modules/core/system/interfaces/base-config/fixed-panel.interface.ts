export type TFixedPanelPos = 'left' | 'right';
export type TFixedPanelState = 'compact' | 'expanded' | 'closed';

export interface IFixedPanelConfig {
    use?: boolean;
    /** Save or not user state to localstorage */
    position?: TFixedPanelPos;
    /** If you want show fixed panel in compact mod by default (in affiliate, for example) */
    compactModByDefault?: boolean;
    sizes?: {
        /** Width fixed panel in compact state */
        compact?: number;
        /** Width fixed panel in full state */
        full?: number;
        /** gap between fixed panel and content */
        gap?: number;
    };
    breakpoints?: {
        /** Breakpoint when burger panel is displaying */
        display?: number;
        /** Breakpoint when burger panel shows in expanded view */
        expand?: number;
    },
};
