import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef,
    ElementRef,
} from '@angular/core';

import _map from 'lodash-es/map';
import _get from 'lodash-es/get';

import {
    AbstractComponent,
    ConfigService,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    StaticService,
    TextDataModel,
} from 'wlc-engine/modules/static';
import {ISlide} from 'wlc-engine/modules/promo';

import * as Params from './testimonials.params';

@Component({
    selector: '[wlc-testimonials]',
    templateUrl: './testimonials.component.html',
    styleUrls: ['./styles/testimonials.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent extends AbstractComponent implements OnInit {
    @Input() public slug: string;
    @ViewChild('tesimonial') tplTestimonial: TemplateRef<ElementRef>;

    public sliderConfig: IWrapperCParams = {};
    public slides: ISlide[] = [];
    public ready: boolean = false;
    public override $params: Params.ITestimonialsCParams;

    protected testimonialsData: Params.ITestimonialsData[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITestimonialsCParams,
        protected staticService: StaticService,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        try {
            const data: TextDataModel = await this.getRawData();
            this.testimonialsData = this.parseTableData(data?.html);
            this.getSwiperConfig();
        } catch (e) {
            if (this.$params.showErrors) {
                console.error('Error post loading');
            }
        } finally {
            this.ready = true;
            this.cdr.detectChanges();
        }
    }

    protected async getRawData(): Promise<TextDataModel> {
        return await this.staticService.getPost(this.slug || this.$params.slug);
    }

    protected parseTableData(htmlRow: string): Params.ITestimonialsData[] {
        const parser: DOMParser = new DOMParser();
        const doc: Document = parser.parseFromString(htmlRow, 'text/html');
        const items: NodeList = doc.querySelectorAll('tr');

        if (!items.length) {
            if (this.$params.showErrors) {
                console.error('No valid or empty post');
            }
            return [];
        }

        return _map(items, (tr: Element): Params.ITestimonialsData => {
            const tdElems: NodeList = tr.querySelectorAll('td');
            return {
                logo: _get(tdElems, '[0].innerHTML'),
                content: _get(tdElems, '[1].innerHTML'),
                linkTitle: _get(tdElems, '[2].innerHTML'),
                linkHref: _get(tdElems, '[3].innerHTML'),
            };
        });
    }

    protected getSwiperConfig(): void {
        this.slides = _map(this.testimonialsData, (item: Params.ITestimonialsData): ISlide => {
            return {
                templateRef: this.tplTestimonial,
                templateParams: {item},
            };
        });

        if (this.$params.sliderParams && this.slides.length <= 1) {
            this.$params.sliderParams.loop = false;
            this.$params.sliderParams.loopedSlides = null;
        }

        this.sliderConfig = {
            components: [
                {
                    name: 'promo.wlc-slider',
                    params: {
                        swiper: this.$params.sliderParams || {},
                        slides: this.slides,
                    },
                },
            ],
        };
    }
}
