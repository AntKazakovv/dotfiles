import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _each from 'lodash-es/each';

import {
    AbstractComponent,
    LogService,
} from 'wlc-engine/modules/core';
import {
    BannersService,
    IBannersFilter,
} from 'wlc-engine/modules/promo/system/services/banners/banners.service';

import * as Params from './banner.params';

/**
 * Displaying banners, takes BannerModel as a parameter.
 *
 * @example
 * {
 *     name: 'promo.wlc-banner',
 *     params: {
 *         filter: {
 *             position: ['any'],
 *         },
 *     },
 * }
 */
@Component({
    selector: '[wlc-banner]',
    templateUrl: './banner.component.html',
    styleUrls: ['./styles/banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent extends AbstractComponent implements OnInit, AfterViewInit {
    public override $params: Params.IBannerCParams;

    @Input() protected inlineParams: Params.IBannerCParams;
    @Input() protected themeMod: Params.ComponentMod;
    @Input() protected filter: IBannersFilter;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBannerCParams,
        protected bannersService: BannersService,
        protected logService: LogService,
        protected element: ElementRef,
        @Inject(DOCUMENT) protected document: Document,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }


    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        await this.bannersService.readyStatus.promise;

        this.getBanner();
        this.setSubscription();
    }

    public ngAfterViewInit(): void {
        setTimeout((): void => {
            this.startVideo();
        }, 0);
    }

    protected getBanner(): void {
        if (this.$params.banner || !this.$params.filter) {
            return;
        }
        this.$params.banner = this.bannersService.getBanners(this.$params.filter).shift();
        this.cdr.markForCheck();
    }

    protected startVideo(): void {
        _each(this.element.nativeElement.querySelectorAll('video'), (video: HTMLVideoElement): void => {
            video.muted = true;
            video.playsInline = true;
            video.play().catch((error: Error): void => {
                this.logService.sendLog({code: '20.0.0', data: {error}});
            });
        });
    }

    private visibilityChange(): void {
        if (!this.document.hidden) {
            this.startVideo();
        }
    }

    private setSubscription(): void {
        fromEvent(this.document, 'visibilitychange')
            .pipe(takeUntil(this.$destroy))
            .subscribe((): void => {
                this.visibilityChange();
            });
    }
}
