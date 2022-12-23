import {TestBed} from '@angular/core/testing';

import {ColorThemeService} from './color-theme.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system/';

describe('ColorThemeService', () => {
    let colorThemeService: ColorThemeService;
    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;

    beforeEach(() => {
        eventServiceSpy = jasmine.createSpyObj('EventService', ['emit', 'subscribe']);
        ConfigServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['load', 'get', 'set'],
            {
                'ready': Promise.resolve(),
            },
        );
        ConfigServiceSpy.get.and.returnValues({});
        ConfigServiceSpy.get.withArgs('$base.colorThemeSwitching').and.returnValue({use: true});

        TestBed.configureTestingModule({
            providers: [
                WINDOW_PROVIDER,
                ColorThemeService,
                {
                    provide: ConfigService,
                    useValue: ConfigServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: LogService,
                    useValue: logServiceSpy,
                },
            ],
        });

        colorThemeService = TestBed.inject(ColorThemeService);
    });

    it('-> should be created', () => {
        expect(colorThemeService).toBeTruthy();
    });

    it('-> should fill service config on init', () => {
        colorThemeService['init']();
        const config = {use: true, altName: 'alt'};
        expect(colorThemeService['config']).toEqual(jasmine.objectContaining(config));
    });
});
