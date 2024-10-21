export interface ISitemapConfig {
    use: boolean;
    xmlConfig?: IXmlConfig;
    excludePath?: string[];
    defaultLanguage?: string;
    router?: ISitemapRouterConfig;
}

export interface IXmlConfig {
    frequentPageChanges?: TFrequentPageChanges;
}

export interface ISitemapRouterConfig {
    catalog?: {
        use: boolean;
    };
    skipRouterNames?: string[];
    excludeRouterNames?: string[];
    includeTokens?: string[];
}

export type TFrequentPageChanges = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
