export interface IBanners {
    [key: string]: IBanner;
}

export interface IBanner {
    html: string;
    platform: string[];
    tags: string[];
    visibility: string[];
}
