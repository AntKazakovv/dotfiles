import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {
    auditTime,
    filter,
    map,
    pairwise,
    startWith,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ActionService,
    ConfigService,
    EventService,
    IBurgerPanelCParams,
    LayoutService,
    LogService,
    SectionModel,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './float-panels.params';

import _set from 'lodash-es/set';
import _findKey from 'lodash-es/findKey';
import _isUndefined from 'lodash-es/isUndefined';
import _get from 'lodash-es/get';
import _map from 'lodash-es/map';
import _each from 'lodash-es/each';
import _assign from 'lodash-es/assign';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';

export type PanelsType = 'left' | 'right';

@Component({
    selector: '[wlc-float-panels]',
    templateUrl: './float-panels.component.html',
    styleUrls: ['./styles/float-panels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatPanelsComponent extends AbstractComponent implements OnInit {
    @Input() public sections: SectionModel[] = [];
    public openedPanel: string = '';
    public $params: Params.IFloatPanelsCParams;
    public shownSections: SectionModel[] = [];

    protected panelIds: string[] = [];
    protected sectionOptions: string[] = [
        'wlcElement',
        'class',
        'theme',
        'type',
        'themeMod',
        'customMod',
        'showHeader',
        'useScroll',
        'display',
        'showClose',
    ];

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
        protected logService: LogService,
        protected actionService: ActionService,
        protected layoutService: LayoutService,
        @Inject(WINDOW) protected window: Window,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        if (!_isUndefined(this.sections) && this.sections.length) {
            this.panelIds = _map(this.sections, (section: SectionModel) => section.name);
            _each(this.sections, (section) => {
                _each(this.sectionOptions, (param) => {
                    if (!_isUndefined(section[param]) && !_get(this.$params, `panels.${section.name}.${param}`)) {
                        _set(this.$params, `panels.${section.name}.${param}`, section[param]);
                    }
                });
            });

            this.normalizeBreakpoints();
            this.filterSection();
            this.initListeners();
        }

        this.actionService.windowResize()
            .pipe(
                takeUntil(this.$destroy),
                startWith(this.window.innerWidth),
                auditTime(100),
                map((): number => this.window.innerWidth),
                pairwise(),
                filter(([prev, current]: number[]): boolean => current !== prev),
            )
            .subscribe(() => {
                this.filterSection();
            });
    }

    public getBurgerPanel(name: string): IBurgerPanelCParams {
        if (this.$params.panels) {
            return _get(this.$params.panels, name);
        }
    }

    public closePanel(panelName?: string): void {
        if (!this.panelIds.includes(panelName)) {
            const error = `Panel ${panelName} doesn't exist! Add panel in $panelsLayouts config.`;
            this.logService.sendLog({code: '0.4.0', data: error});
            return;
        }
        this.openedPanel = '';
        this.removeModifiers(['open', `opened-${panelName}`]);
        this.document.body.style.overflow = null;
    }

    protected normalizeBreakpoints(): void {
        _each(this.sections, (section) => {
            if (_isUndefined(section.display?.before)) {
                _assign(section.display, {before: 999999999});
            }

            if (_isUndefined(section.display?.after)) {
                _assign(section.display, {after: 0});
            }
        });
    }

    protected filterSection(): void {
        this.shownSections = _filter(this.sections, (section) => {
            if (!this.getBurgerPanel(section.name)?.type) {
                return false;
            }

            if (!section.display) {
                return true;
            }

            if (section.display?.after || section.display?.before) {
                return this.window.matchMedia(this.layoutService.createMediaQuery(section.display)).matches;
            }
        });

        if (this.openedPanel) {
            this.closePanel(this.openedPanel);
        }
        this.cdr.markForCheck();
    }

    protected initListeners(): void {
        this.eventService.subscribe(
            {name: Params.panelsEvents.PANEL_OPEN},
            (data: PanelsType) => {
                const panelName = this.firstPanelNameByType(data);
                if (panelName) {
                    this.openPanel(panelName);
                }
            },
            this.$destroy,
        );

        this.eventService.subscribe(
            {name: Params.panelsEvents.PANEL_CLOSE},
            (data: PanelsType) => {
                this.closePanel(data);
            },
            this.$destroy,
        );

        this.eventService.emit({
            name: 'FILTER_PANELS',
            data: this.shownSections,
        });
        this.configService.set({
            name: 'isPanelsFiltered',
            value: true,
        });
    }

    protected firstPanelNameByType(type: PanelsType): string {
        return _findKey(this.$params.panels, (item, key) => {
            return item.type === type && _find(this.shownSections, (section) => section.name === key);
        });
    }

    protected openPanel(panelName: string): void {
        if (!this.panelIds.includes(panelName)) {

            const error = `Panel ${panelName} doesn't exist! Add panel in $panelsLayouts config.`;
            this.logService.sendLog({code: '0.4.0', data: error});
            // this error for developers
            console.error(error);
            return;
        }
        this.openedPanel = panelName;
        this.addModifiers(['open', `opened-${panelName}`]);
        this.document.body.style.overflow = 'hidden';
    }
}
