import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {StaticService, TextDataModel} from 'wlc-engine/modules/static';
import {
    IFaqComponentParams,
    IFaqData,
} from './faq.interface';

import {
    map as _map,
    get as _get,
    forEach as _forEach,
    isUndefined as _isUndefined,
} from 'lodash';

@Component({
    selector: '[wlc-faq]',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent extends AbstractComponent implements OnInit {
    public faqData: IFaqData[];

    @Input() protected slug: string;
    protected defaultSlug: string = 'partners-faq';
    protected showErrors: boolean;

    constructor(
        @Inject('params') protected params: IFaqComponentParams,
        protected staticService: StaticService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({params, defaultParams: {}});
    }

    async ngOnInit(): Promise<void> {
        this.showErrors = _isUndefined(this.params.showErrors) ? true : this.params.showErrors;
        try {
            const data: TextDataModel = await this.getRawData();
            this.faqData = this.parseTableData(data?.html);
            this.cdr.detectChanges();
        } catch (e) {
            if (this.showErrors) {
                console.error('Error post loading');
            }
        }
    }

    public expandToggle(item: IFaqData): void {
        if(this.params.collapseAll) {
            const prevState = item.expand;
            this.foldAll();
            item.expand = !prevState;
        } else {
            item.expand = !item.expand;
        }
    }

    protected async getRawData(): Promise<TextDataModel> {
        return await this.staticService.getStaticText(this.slug || this.params.slug || this.defaultSlug);
    }

    protected parseTableData(htmlRow: string): IFaqData[] {
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
        _forEach(this.faqData, (item: IFaqData) => {
            item.expand = false;
        });
    }
}
