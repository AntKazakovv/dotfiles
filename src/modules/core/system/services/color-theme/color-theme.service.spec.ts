import {TestBed} from '@angular/core/testing';

import {ColorThemeService} from './color-theme.service';
import {ColorThemeValues, ConfigService} from 'wlc-engine/modules/core';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {UserService} from 'wlc-engine/modules/user';

describe('ColorThemeService', () => {
    let colorThemeService: ColorThemeService;
    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;

    beforeEach(() => {
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
            imports: [AppModule],
            providers: [
                ColorThemeService,
                {
                    provide: ConfigService,
                    useValue: ConfigServiceSpy,
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
