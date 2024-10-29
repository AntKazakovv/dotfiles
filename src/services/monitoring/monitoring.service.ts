import {
    inject,
    Injectable,
} from '@angular/core';

import {
    LCPMetric,
    CLSMetric,
    FCPMetric,
    TTFBMetric,
    onLCP,
    onCLS,
    onFCP,
    onTTFB,
} from 'web-vitals';

import {LogService} from 'wlc-engine/modules/core';
import {
    IListMetricsPerformanceReport,
    TListMetricsPerformanceReport,
} from 'wlc-engine/modules/core/system/interfaces/base-config/monitoring.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

@Injectable({
    providedIn: 'root',
})
export class MonitoringService {

    private configMetrics: IListMetricsPerformanceReport;

    private readonly configService: ConfigService = inject(ConfigService);
    private readonly logService: LogService = inject(LogService);

    constructor() {
        this.init();

        this.configMetrics = this.configService.get('$base.monitoring.performanceReport');
    }

    private async init(): Promise<void> {
        await this.configService.ready;

        this.configMetrics.listMetrics.forEach((metric: TListMetricsPerformanceReport) => {
            switch (metric) {
                case 'LCP':
                    this.setLCPMetric();
                    break;
                case 'FCP':
                    this.setFCPMetric();
                    break;
                case 'CLS':
                    this.setCLSMertric();
                    break;
                case 'TTFB':
                    this.setTTFBMetric();
                    break;
            }
        });
    }

    private setLCPMetric(): void {
        onLCP((metric: LCPMetric) => {
            this.logService.sendLog({
                code: '33.0.1',
                flog: {
                    time: metric.value,
                },
            });
        });
    }

    private setFCPMetric(): void {
        onFCP((metric: FCPMetric) => {
            this.logService.sendLog({
                code: '33.0.6',
                flog: {
                    time: metric.value,
                },
            });
        });
    }

    private setCLSMertric(): void {
        onCLS((metric: CLSMetric) => {
            this.logService.sendLog({
                code: '33.0.7',
                flog: {
                    time: metric.value,
                },
            });
        });
    }

    private setTTFBMetric(): void {
        onTTFB((metric: TTFBMetric) => {
            this.logService.sendLog({
                code: '33.0.8',
                flog: {
                    time: metric.value,
                },
            });
        });
    }
}
