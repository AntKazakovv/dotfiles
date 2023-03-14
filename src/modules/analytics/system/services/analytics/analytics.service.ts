import {
    Inject,
    Injectable,
} from '@angular/core';
import {
    IAnalytics,
    IEventParams,
    ITag,
    ITagEvent,
} from 'wlc-engine/modules/analytics/system/interfaces/analytics.interface';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {IIndexing} from 'wlc-engine/modules/core';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {

    private analyticsConfig: IAnalytics;

    constructor(
        private configService: ConfigService,
        private eventService: EventService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.init();
    }

    private setTags(): void {
        if (!this.analyticsConfig?.tags?.length) {
            return;
        }

        const subscriptions: IIndexing<Function[]> = {};

        this.analyticsConfig.tags.forEach((tag: ITag) => {
            if (!tag.use || !tag.events.length) {
                return;
            }

            tag.events.forEach((ev: ITagEvent) => {
                const handler: Function = this.getEventHandler(tag.methodName, ev, ev.params);
                const key = ev.event;

                if (subscriptions[key]) {
                    subscriptions[key].push(handler);
                } else {
                    subscriptions[key] = [handler];
                }
            });
        });

        for (const key in subscriptions) {
            const handlers: Function[] = subscriptions[key];

            this.eventService.subscribe({
                name: key,
            }, () => {
                handlers.forEach((handler: Function) => handler());
            });
        }
    }

    private getEventHandler(methodName: TMethodName, event: ITagEvent, params?: IEventParams): Function {
        return () => {
            this.window[methodName](event.type, event.name, params);
        };
    }

    private async init(): Promise<void> {
        await this.configService.ready;
        this.analyticsConfig = this.configService.get<IAnalytics>('$base.analytics');
        this.setTags();
    }
}
