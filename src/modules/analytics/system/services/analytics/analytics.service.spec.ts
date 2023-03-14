import {TestBed} from '@angular/core/testing';
import {ConfigService, EventService} from 'wlc-engine/modules/core';
import {
    IAnalytics,
    ITagEvent,
    TFacebookPixelEventType,
    TGtagEventType,
} from 'wlc-engine/modules/analytics/system/interfaces/analytics.interface';
import {AnalyticsService} from './analytics.service';
import {
    WINDOW,
    WINDOW_PROVIDER,
} from 'wlc-engine/modules/app/system';

describe('AnalyticsService', () => {
    let analyticsService: AnalyticsService;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let window: Window;

    const analyticsConfig: IAnalytics = {
        use: true,
        tags: [
            {
                name: 'testTag',
                use: true,
                methodName: 'fbq',
                events: [
                    {
                        event: 'TEST_EVENT',
                        type: 'track',
                        name: 'Lead',
                    },
                ],
            },
        ],
    };

    beforeEach(() => {
        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['load', 'get'],
            {
                'ready': Promise.resolve(),
            },
        );

        configServiceSpy.get.and.returnValues({});
        configServiceSpy.get.withArgs('$base.analytics').and.returnValues({analyticsConfig});
        eventServiceSpy = jasmine.createSpyObj('EventService', ['emit', 'subscribe']);

        TestBed.configureTestingModule({
            providers: [
                WINDOW_PROVIDER,
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
            ],
        });

        analyticsService = TestBed.inject(AnalyticsService);
        window = TestBed.inject<Window>(WINDOW);

        return configServiceSpy.ready;
    });

    it('-> should be created', () => {
        expect(analyticsService).toBeTruthy();
    });

    it('-> sets the tag and emits its event', () => {
        let result = {};
        let testEvent: ITagEvent = analyticsConfig.tags[0].events[0];

        window.fbq = (eventType: TFacebookPixelEventType | TGtagEventType, eventName: string) => {
            result = {
                eventType,
                eventName,
            };

            expect(result).toEqual({
                eventType: testEvent.type,
                eventName: testEvent.name,
            });
        };
    });
});
