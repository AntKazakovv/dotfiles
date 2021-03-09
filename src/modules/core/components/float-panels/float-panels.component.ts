import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {
    debounceTime,
    takeUntil,
} from 'rxjs/operators';
import {
    IResizeEvent,
    LayoutService,
} from 'wlc-engine/modules/core';
import {
    ActionService,
    ConfigService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {SectionModel} from 'wlc-engine/modules/core/system/models/section.model';
import {IBurgerPanelCParams} from 'wlc-engine/modules/core';
import * as Params from './float-panels.params';

import {
    get as _get,
    set as _set,
    filter as _filter,
    find as _find,
    findKey as _findKey,
    isUndefined as _isUndefined,
    map as _map,
    each as _each,
    assign as _assign,
} from 'lodash-es';

type PanelsType = 'left' | 'right';

@Component({
    selector: '[wlc-float-panels]',
    templateUrl: './float-panels.component.html',
    styleUrls: ['./styles/float-panels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatPanelsComponent extends AbstractComponent implements OnInit {
    @Input() public sections: SectionModel[] = [];
    public openedPanel: string;
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
    ];

    constructor(
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
        protected logService: LogService,
        protected actionService: ActionService,
        protected layoutService: LayoutService,
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
                    if (!_isUndefined(section[param])  && !_get(this.$params, `panels.${section.name}.${param}`)) {
                        _set(this.$params, `panels.${section.name}.${param}`, section[param]);
                    }
                });
            });

            this.normalizeBreakpoints();
            this.filterSection();
            this.initListeners();
        }

        this.actionService.windowResize()
            .pipe(debounceTime(500), takeUntil(this.$destroy))
            .subscribe((event: IResizeEvent) => {
                this.filterSection();
            });
    }

    public getBurgerPanel(name: string): IBurgerPanelCParams {
        if (this.$params.panels) {
            return _get(this.$params.panels, name);
        }
        return;
    }

    public closePanel(panelName?: string): void {
        if (!this.panelIds.includes(panelName)) {
            const error = `Panel ${panelName} doesn't exist! Add panel in $panelsLayouts config.`;
            this.logService.sendLog({code: '0.4.0', data: error});
            // this error for developers
            console.error(error);
            return;
        }
        this.openedPanel = '';
        this.removeModifiers(['open', `opened-${panelName}`]);
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
                return globalThis.matchMedia(this.layoutService.createMediaQuery(section.display)).matches;
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
    }
}
