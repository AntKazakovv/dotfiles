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
    IAccordionData,
    IAccordionCParams,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    StaticService,
    TextDataModel,
} from 'wlc-engine/modules/static';

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
    public override $params: Params.IFaqCParams;
    public accordionParams: IAccordionCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFaqCParams,
        protected staticService: StaticService,
        cdr: ChangeDetectorRef,
        protected logService: LogService,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.accordionParams = {
            title: this.$params.title,
            titleIconPath: this.$params.titleIconPath,
            collapseAll: this.$params.collapseAll,
            items: [],
        };
        try {
            const data: TextDataModel = await this.getRawData();
            this.accordionParams.items = this.parseTableData(data?.html);
        } catch (error) {
            this.accordionParams = {};
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
        const textBefore: Node = doc.querySelector('text-before');
        const textAfter: Node = doc.querySelector('text-after');
        const items: NodeList = doc.querySelectorAll('tr');

        if (textBefore) {
            this.accordionParams.textBefore = textBefore.textContent.split('\n');
        }
        if (textAfter) {
            this.accordionParams.textAfter = textAfter.textContent.split('\n');
        }

        if (!items.length && !textBefore && !textAfter) {
            this.accordionParams.isEmpty = true;
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
                content: [_get(tdElems, '[1].innerHTML')],
                expand: false,
            };
        });
    }
}
