import {TProcessConfigs} from 'wlc-engine/modules/monitoring';

export interface IMonitoringConfig {
    /**
     * Config for Process Service (monitoring of processes)
     */
    processConfigs?: TProcessConfigs;
}
