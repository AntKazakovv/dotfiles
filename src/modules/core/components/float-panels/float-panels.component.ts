import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {
    ConfigService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {SectionModel} from 'wlc-engine/modules/core/system/models/section.model';
import * as Params from './float-panels.params';
import {IBurgerPanelCParams} from './../burger-panel/burger-panel.params';

import {
    get as _get,
    isUndefined as _isUndefined,
    map as _map,
} from 'lodash';


@Component({
    selector: '[wlc-float-panels]',
    templateUrl: './float-panels.component.html',
    styleUrls: ['./styles/float-panels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatPanelsComponent extends AbstractComponent implements OnInit {
    @Input() public sections: SectionModel[] = [];
    public openedPanel: string;
    public $params: Params.IFloatPanelsComponentParams;

    protected panelIds: string[] = [];

    constructor(
        protected configService: ConfigService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
        protected logService: LogService,
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
            this.initListeners();
        }
    }

    public getBurgerPanel(name: string): IBurgerPanelCParams {
        if (this.$params.panels) {
            return _get(this.$params.panels, name);
        }
        return;
    }

    protected initListeners(): void {
        this.eventService.subscribe(
            {name: Params.panelsEvents.PANEL_OPEN},
            (data: string) => {
                this.openPanel(data);
            },
            this.$destroy,
        );

        this.eventService.subscribe(
            {name: Params.panelsEvents.PANEL_CLOSE},
            (data: string) => {
                this.closePanel(data);
            },
            this.$destroy,
        );
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

    protected closePanel(panelName?: string): void {
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
}
