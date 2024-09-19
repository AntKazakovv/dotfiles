import {
    inject,
    Injectable,
} from '@angular/core';

import {
    LCPMetric,
    onLCP,
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
}
