import {TProcessConfigs} from 'wlc-engine/modules/monitoring';

interface ILoggingLoadedSections {
    use: boolean;
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
    listMetrics?: [TListMetricsPerformanceReport];
}

export type TListMetricsPerformanceReport = 'LCP';
