import {TestBed} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {DeviceModel} from 'wlc-engine/modules/core/system/models/device.model';
import {ActionService} from './action.service';

declare const viewport;

describe('ActionService', () => {
    let actionService: ActionService;
    let window: Window;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [ActionService],
        });

        window = TestBed.inject<Window>(WINDOW);
        actionService = TestBed.inject(ActionService);
    });

    it('-> should be created', () => {
        expect(actionService).toBeTruthy();
    });

    it('-> lockBody/unlockBody: checking adding and removing styles', () => {
        const body = document.querySelector('body');

        actionService.lockBody();
        expect(body.style.height).toEqual('100%');
        expect(body.style.overflow).toEqual('hidden');

        actionService.unlockBody();
        expect(body.style.height).toEqual('');
        expect(body.style.overflow).toEqual('');
    });

    it('-> deviceOrientation: check deviceOrientation method', () => {

        actionService.device = new DeviceModel({
            breakpoints: {
                desktop: 1024,
                tablet: 768,
                mobile: 0,
            },
        }, window);

        viewport.set('mobile');
        expect(actionService.deviceOrientation()).toEqual('portrait');

        viewport.set('tablet');
        expect(actionService.deviceOrientation()).toEqual('portrait');

        viewport.set('screen');
        expect(actionService.deviceOrientation()).toEqual('landscape');

        viewport.reset();
    });
});
