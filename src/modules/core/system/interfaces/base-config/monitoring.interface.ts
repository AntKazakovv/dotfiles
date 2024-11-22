import {TProcessConfigs} from 'wlc-engine/modules/monitoring';

export type TLoggingLoadedSections = 'main-menu' | 'banners';

interface ILoggingLoadedSections {
    use?: boolean;
    sections?: TLoggingLoadedSections[];
}

export interface IMonitoringConfig {
    /**
     * Config for Process Service (monitoring of processes)
     */
    processConfigs?: TProcessConfigs;
    loggingLoadedSections?: ILoggingLoadedSections;
    loggingLoadedFullSite?: boolean;
    performanceReport?: IListMetricsPerformanceReport;
}

export interface IListMetricsPerformanceReport {
    use?: boolean;
    listMetrics?: TListMetricsPerformanceReport[];
}

export type TListMetricsPerformanceReport = 'LCP' | 'CLS' | 'FCP' | 'TTFB' | 'FID';
