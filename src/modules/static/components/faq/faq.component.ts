import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import _map from 'lodash-es/map';
import _get from 'lodash-es/get';

import {
    AbstractComponent,
    LogService,
    HeightToggleAnimation,
} from 'wlc-engine/modules/core';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {
    IAccordionData,
    IAccordionCParams,
} from 'wlc-engine/modules/core/components/accordion/accordion.params';

import * as Params from './faq.params';

@Component({
    selector: '[wlc-faq]',
    templateUrl: './faq.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: HeightToggleAnimation,
})
export class FaqComponent extends AbstractComponent implements OnInit {
    @Input() protected slug: string;

    public ready: boolean = false;
    public $params: Params.IFaqCParams;
    public accordionParams: IAccordionCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFaqCParams,
        protected staticService: StaticService,
        protected cdr: ChangeDetectorRef,
        protected logService: LogService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.accordionParams = {
            title: this.$params.title || this.$params.common.title,
            titleIconPath: this.$params.titleIconPath,
            collapseAll: this.$params.collapseAll || this.$params.common.collapseAll,
            items: [],
        };

        try {
            const data: TextDataModel = await this.getRawData();
            this.accordionParams.items = this.parseTableData(data?.html);
        } catch (error) {
            this.logService.sendLog({
                code: '5.0.2',
                data: error,
                level: 'error',
                from: {
                    component: 'FaqComponent',
                    method: 'ngOnInit',
                },
            });
        } finally {
            this.ready = true;
            this.cdr.detectChanges();
        }
    }

    protected async getRawData(): Promise<TextDataModel> {
        return await this.staticService.getPost(this.slug || this.$params.slug);
    }

    protected parseTableData(htmlRow: string): IAccordionData[] {
        const parser: DOMParser = new DOMParser();
        const doc: Document = parser.parseFromString(htmlRow, 'text/html');
        const items: NodeList = doc.querySelectorAll('tr');

        if (!items.length) {
            this.logService.sendLog({
                code: '7.0.2',
                data: 'No valid or empty post',
                from: {
                    component: 'FaqComponent',
                    method: 'parseTableData',
                },
            });
            return;
        }

        return _map(items, (tr: Element) => {
            const tdElems: NodeList = tr.querySelectorAll('td');
            return {
                title: _get(tdElems, '[0].innerHTML'),
                content: _get(tdElems, '[1].innerHTML'),
                expand: false,
            };
        });
    }
}
