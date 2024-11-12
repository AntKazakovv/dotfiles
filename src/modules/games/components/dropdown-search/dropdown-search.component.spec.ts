import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {
    Component,
    Directive,
    Input,
} from '@angular/core';
import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {ScrollbarComponent} from 'wlc-engine/modules/core/components/scrollbar/scrollbar.component';
import {DropdownSearchComponent} from './dropdown-search.component';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import * as Params from './dropdown-search.params';
import {GamesFilterService} from 'wlc-engine/modules/games';

describe('DropdownSearchComponent', () => {
    const injectParams: Params.IDropdownSearchCParams = {
        theme: 'default',
        themeMod: 'default',
        type: 'default',
        wlcElement: 'wlc-dropdown-search',
    };
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['get']);
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['emit', 'subscribe']);
    const gamesFilterService = jasmine.createSpyObj('GamesFilterService', ['set']);
    const gamesCatalogService: GamesCatalogService = jasmine.createSpyObj('GamesCatalogService', null, {
        'ready': Promise.resolve(),
    });
    let component: DropdownSearchComponent;
    let fixture: ComponentFixture<DropdownSearchComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ClickOutsideDirective,
                DropdownSearchComponent,
                SpyScrollbarComponent,
                SearchFieldComponent,
                SaComponent,
            ],
            providers: [
                {provide: 'injectParams', useValue: injectParams},
                {provide: GamesCatalogService, useValue: gamesCatalogService},
                {provide: ConfigService, useValue: configServiceSpy},
                {provide: EventService, useValue: eventServiceSpy},
                {provide: GamesFilterService, useValue: gamesFilterService},
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DropdownSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('-> checking the clickOnTheSearchField method', async () => {
        await component.ngOnInit();
        component.clickOnTheSearchField();
        expect(component.isOpened).toBeTrue();
    });

    it('-> checking the clickOutside method', async () => {
        await component.ngOnInit();
        component.clickOutside();
        expect(component.isOpened).toBeFalse();
    });

    it('-> checking the setSearchQuery method', async () => {
        await component.ngOnInit();
        fixture.detectChanges();
        component.setSearchQuery('string');
        expect(component.isOpened).toBeTrue();
    });
});

@Directive({selector: '[wlc-click-outside]'})
class ClickOutsideDirective {
    @Input() isOpened;
}

@Component({selector: '[wlc-sa]'})
class SaComponent {
    @Input('wlc-sa-input-params') inputParams;
    @Input('wlc-sa') name;
}

@Component({selector: '[wlc-search-field]'})
class SearchFieldComponent {
    @Input() showClearIcon;
    @Input() inlineParams;
}

@Component({
    selector: '[wlc-scrollbar]',
    providers: [
        {
            provide: ScrollbarComponent,
            useClass: SpyScrollbarComponent,
        },
    ],
})
class SpyScrollbarComponent {
    @Input() showClearIcon;
    @Input() inlineParams;
    public setProgress(): void {}
}
