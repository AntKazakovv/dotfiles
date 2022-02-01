import {fakeAsync, TestBed} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {ConfigService, EventService} from 'wlc-engine/modules/core';
import {IAnalytics, ITagEvent} from '../../interfaces/analytics.interface';
import {AnalyticsService} from './analytics.service';

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let eventService: EventService;
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

        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                AnalyticsService,
                EventService,
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
            ],
        });

        service = TestBed.inject(AnalyticsService);
        eventService = TestBed.inject(EventService);
        window = TestBed.inject<Window>(WINDOW);

        return configServiceSpy.ready;
    });

    it('-> should be created', () => {
        expect(service).toBeTruthy();
    });

    it('-> sets the tag and emits its event', fakeAsync(() => {
        let result = {};
        let testEvent: ITagEvent = analyticsConfig.tags[0].events[0];

        window.fbq = (eventType, eventName) => {
            result = {
                eventType,
                eventName,
            };

            expect(result).toEqual({
                eventType: testEvent.type,
                eventName: testEvent.name,
            });
        };

        eventService.emit({name: 'TEST_EVENT'});
    }));
});
