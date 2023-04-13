import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    ViewChild,
    ElementRef,
    Input,
    ChangeDetectorRef,
    Renderer2,
} from '@angular/core';

import _floor from 'lodash-es/floor';
import _random from 'lodash-es/random';
import _times from 'lodash-es/times';
import  _each from 'lodash-es/each';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

import * as Params from './rating.params';

@Component({
    selector: '[wlc-rating]',
    templateUrl: './rating.component.html',
    styleUrls: ['./styles/rating.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent extends AbstractComponent implements OnInit {
    @ViewChild('starsParent', {static: true}) protected starsParent: ElementRef<HTMLElement>;
    @Input() protected inlineParams: Params.IRatingCParams;

    public override $params: Params.IRatingCParams;
    public stars: number[];

    protected rating: number = 0;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRatingCParams,
        configService: ConfigService,
        protected cachingService: CachingService,
        protected renderer: Renderer2,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IRatingCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.stars = _times(this.$params.starsCount, (n: number) => n);
        this.renderer.setStyle(this.starsParent.nativeElement, '--stars-count', this.stars.length, 2);
        this.initRating();
    }

    protected setCssVariable(item: HTMLElement, value: string = '1'): void {
        this.renderer.setStyle(item, '--transform', value, 2);
    }

    protected setRating(): void {
        const integralPart = _floor(this.rating);

        _each(
            this.starsParent.nativeElement.children,
            (item: HTMLElement, index: number) => {
                if (index < integralPart) {
                    this.setCssVariable(item);
                }

                if (index > integralPart) {
                    this.setCssVariable(item, '0');
                }

                if (index === integralPart) {
                    this.setCssVariable(item, `${this.rating - integralPart}`);
                }
            },
        );
    }

    protected async initRating(): Promise<void> {
        const {from, to, use} = this.$params.mock;

        if (use) {
            const result = await this.cachingService.get<number>('cached-mock-rating');

            if (result) {
                this.rating = result;
            } else {
                this.rating = _floor(_random(from, to), 1);
                this.cachingService.set<number>('cached-mock-rating', this.rating, false, 1000 * 60 * 60 * 24);
            }

            this.setRating();
            this.cdr.markForCheck();
        }
    }
}
