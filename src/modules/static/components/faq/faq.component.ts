import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';


import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {HeightToggleAnimation} from 'wlc-engine/modules/core/system/animations/height-toggle.animation';

import * as Params from './faq.params';

export {IFaqCParams} from './faq.params';

import _map from 'lodash-es/map';
import _forEach from 'lodash-es/forEach';
import _isUndefined from 'lodash-es/isUndefined';
import _get from 'lodash-es/get';

@Component({
    selector: '[wlc-faq]',
    templateUrl: './faq.component.html',
    styleUrls: ['./styles/faq.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: HeightToggleAnimation,
})
export class FaqComponent extends AbstractComponent implements OnInit {
    public faqData: Params.IFaqData[];
    public ready: boolean = false;
    public $params: Params.IFaqCParams;

    @Input() protected slug: string;
    protected showErrors: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFaqCParams,
        protected staticService: StaticService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.showErrors = _isUndefined(this.$params.common?.showErrors) ? true : this.$params.common?.showErrors;
        try {
            const data: TextDataModel = await this.getRawData();
            this.faqData = this.parseTableData(data?.html);
        } catch (e) {
            if (this.showErrors) {
                console.error('Error post loading');
            }
        } finally {
            this.ready = true;
            this.cdr.detectChanges();
        }
    }

    public expandToggle(item: Params.IFaqData): void {
        if(this.$params.common?.collapseAll) {
            const prevState = item.expand;
            this.foldAll();
            item.expand = !prevState;
        } else {
            item.expand = !item.expand;
        }
    }

    protected async getRawData(): Promise<TextDataModel> {
        return await this.staticService.getPost(this.slug || this.$params.slug);
    }

    protected parseTableData(htmlRow: string): Params.IFaqData[] {
        const parser: DOMParser = new DOMParser();
        const doc: Document = parser.parseFromString(htmlRow, 'text/html');
        const items: NodeList = doc.querySelectorAll('tr');

        if (!items.length) {
            if (this.showErrors) {
                console.error('No valid or empty post');
            }
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

    protected foldAll(): void {
        _forEach(this.faqData, (item: Params.IFaqData) => {
            item.expand = false;
        });
    }
}
