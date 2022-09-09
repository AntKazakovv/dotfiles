import {
    Component,
    Directive,
    Input,
} from '@angular/core';
import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import _trim from 'lodash-es/trim';

import {ConfigService} from 'wlc-engine/modules/core';
import {LootboxPrizeComponent} from './lootbox-prize.component';
import * as Params from './lootbox-prize.params';

interface LootboxPrizeModelStub {
    name: string;
    imageProfileFirst: string;
    image: string;
}

interface ILootboxPrizeCParamsStub extends Partial<Omit<Params.ILootboxPrizeCParams, 'prize'>> {
    prize: LootboxPrizeModelStub;
}

interface IConfigServiceStub extends Partial<Omit<ConfigService, 'get'>> {
    get(): {};
}

interface ISetupConfig {
    isProfileFirst: boolean,
    image: boolean
}

describe('LootboxPrizeComponent', (): void => {
    let component: LootboxPrizeComponent;
    let fixture: ComponentFixture<LootboxPrizeComponent>;
    let nativeElement: HTMLElement;

    let configServiceStub: IConfigServiceStub;

    let configGetSpy: jasmine.Spy;

    let injectParams: ILootboxPrizeCParamsStub;
    let defaultParams: Partial<Params.ILootboxPrizeCParams> = Params.defaultParams;

    const setup = (config: ISetupConfig = {isProfileFirst: false, image: true}): void => {
        injectParams = {
            theme: 'default',
            themeMod: 'default',
            type: 'default',
            wlcElement: 'wlc-lootbox-prize',
            prize: {
                name: 'Prize simple name',
                image: config.image ? 'imageProfileDefault' : '',
                imageProfileFirst: config.image ? 'imageProfileFirst' : '',
            },
        };

        configServiceStub = {
            get() {
                return {};
            },
        };

        TestBed.configureTestingModule({
            declarations: [
                LootboxPrizeComponent,
                IconComponent,
                ClampDirective,
            ],
            providers: [
                {provide: ConfigService, useValue: configServiceStub},
                {provide: 'injectParams', useValue: injectParams},
            ],
        });

        configGetSpy = spyOn(TestBed.inject(ConfigService), 'get');
        configGetSpy.and.returnValue(config.isProfileFirst ? 'first' : 'default');

        fixture = TestBed.createComponent(LootboxPrizeComponent);
        nativeElement = fixture.nativeElement;
        component = fixture.componentInstance;

        fixture.detectChanges();
    };

    it('-> should create', (): void => {
        setup();
        expect(component).toBeDefined();
    });

    it('-> check bgImage for default profile', (): void => {
        setup();
        expect(component.bgImage).toBe(component.$params.prize.image);
    });

    it('-> check bgImage for first profile', (): void => {
        setup({isProfileFirst: true, image: true});
        expect(component.bgImage).toBe(component.$params.prize.imageProfileFirst);
    });

    it('-> check image in default profile', (): void => {
        setup();
        expect(nativeElement.querySelector(`.${defaultParams.class}__image`)).toEqual(jasmine.anything());
    });

    it('-> check shadow block in default profile', (): void => {
        setup();
        expect(nativeElement.querySelector(`.${defaultParams.class}__shadow`)).toEqual(jasmine.anything());
    });

    it('-> the absence image in default profile without image in params', (): void => {
        setup({isProfileFirst: false, image: false});
        expect(nativeElement.querySelector(`.${defaultParams.class}__image`)).not.toEqual(jasmine.anything());
    });

    it('-> the absence shadow block in default profile without image in params', (): void => {
        setup({isProfileFirst: false, image: false});
        expect(nativeElement.querySelector(`.${defaultParams.class}__shadow`)).not.toEqual(jasmine.anything());
    });

    it('-> image on first profile', (): void => {
        setup({isProfileFirst: true, image: true});
        expect(nativeElement.querySelector(`.${defaultParams.class}__image`)).toEqual(jasmine.anything());
    });

    it('-> the absence image in first profile without image in params', (): void => {
        setup({isProfileFirst: true, image: false});
        expect(nativeElement.querySelector(`.${defaultParams.class}__image`)).not.toEqual(jasmine.anything());
    });

    it('-> the absence shadow block in first profile', (): void => {
        setup({isProfileFirst: true, image: true});
        expect(nativeElement.querySelector(`.${defaultParams.class}__shadow`)).not.toEqual(jasmine.anything());
    });

    it('-> check name in template', (): void => {
        setup();
        expect(_trim(nativeElement.querySelector(`.${defaultParams.class}__name`).textContent))
            .toBe(component.$params.prize.name);
    });

    it('-> icon block on default profile', (): void => {
        setup();
        expect(nativeElement.querySelector('[wlc-icon]')).toEqual(jasmine.anything());
    });

    it('-> the absence of a icon block on first profile', (): void => {
        setup({isProfileFirst: true, image: true});
        expect(nativeElement.querySelector('[wlc-icon]')).not.toEqual(jasmine.anything());
    });
});

@Component({selector: '[wlc-icon]'})
class IconComponent {
    @Input() iconPath;
}

@Directive({
    selector: '[wlc-clamp]',
})
export class ClampDirective {
    @Input('wlc-clamp') lines;
}
