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

export interface IFixedPanelItemParams {
    sizes?: IFixedPanelSizes;
    breakpoints?: {
        /** Breakpoint when burger panel is displaying */
        display?: number;
        /** Breakpoint when burger panel shows in expanded view */
        expand?: number;
    };
    /** If you want show fixed panel in compact mod by default (in affiliate, for example) */
    compactModByDefault?: boolean;
    /** Use animations after collapsing/expanding fixed panel */
    useInnerAnimations?: boolean;
    /** Use backdrop when fixed panel overlaps main content */
    useBackdrop?: boolean;
}

export interface IFixedPanelConfig {
    use?: boolean;
    /** Save or not user state to localstorage */
    panels?: Partial<Record<TFixedPanelPos, IFixedPanelItemParams>>;
};

export type TFixedPanelStore = Partial<Record<TFixedPanelPos, TFixedPanelState>>;
