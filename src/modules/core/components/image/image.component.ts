import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    OnChanges,
    Inject,
    Optional,
    ChangeDetectionStrategy,
    EventEmitter,
    Output,
} from '@angular/core';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';

import * as Params from './image.params';

@Component({
    selector: '[wlc-image]',
    templateUrl: './image.component.html',
    styleUrls: ['./styles/image.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input('slimSrc') protected _slimSrc: string;
    @Input('slimSources') protected _slimSources: Params.ISource[];
    @Input('src') protected _src: string;
    @Input('sources') protected _sources: Params.ISource[];
    @Input('wlcElement') protected _wlcElement: string;
    @Input('customMod') protected _customMod: string | string[];
    @Input('fallback') protected _fallback: string;
    @Input('hideOnError') protected _hideOnError: boolean;

    @Input() protected inlineParams: Params.IImageCParams;

    @Output() loadSuccess = new EventEmitter<void>();
    @Output() loadError = new EventEmitter<void>();

    public override $params: Params.IImageCParams;

    protected customSlimSources: Params.ISource[];
    protected customSlimSrc: string;
    protected customSources: Params.ISource[];

    constructor(
        @Optional()
        @Inject('injectParams') protected injectParams: Params.IImageCParams,
    ) {
        super({
            injectParams: injectParams || {},
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.handleCdnImages();
    }

    public get slimSrc(): string {
        return this.customSlimSrc || this._slimSrc || this.$params.slimSrc;
    }

    public get slimSources(): Params.ISource[] {
        return this.customSlimSources || this._slimSources || this.$params.slimSources;
    }

    public get src(): string {
        return this.src || this.$params.src;
    }

    public get sources(): Params.ISource[] {
        return this.customSources || this.sources || this.$params.sources;
    }

    public get wlcElement(): string {
        return this._wlcElement || this.$params.wlcElement;
    }

    public get fallback(): string {
        return this._fallback || this.$params.fallback;
    }

    public get hideOnError(): boolean {
        return this._hideOnError || this.$params.hideOnError;
    }

    public onError(): void {
        this.loadError.emit();
    }

    public onLoad(): void {
        this.loadSuccess.emit();
    }

    protected handleCdnImages(): void {
        if (this.src.indexOf(GlobalHelper.gstaticUrl) >= 0) {
            const imgPath = this.src.replace(GlobalHelper.gstaticUrl, '');

            if (imgPath.indexOf('/games') === 0) {

                if (this.configService.get<boolean>('$base.optimization.slimExtraImages.use')) {
                    this.customSlimSrc = `${GlobalHelper.gstaticUrl}/slim-extra${imgPath}`;
                    this.customSlimSources = [
                        {
                            srcset: GlobalHelper.setFileExtension(this.customSlimSrc, 'webp'),
                            type: 'image/webp',
                        },
                    ];
                }

                if (!this.sources) {
                    this.customSources = [
                        {
                            srcset: GlobalHelper.setFileExtension(this.src, 'webp'),
                            type: 'image/webp',
                        },
                    ];
                }
            }
        }
    }

    protected getFallback(src: string): string {
        if (this.hideOnError) {
            return;
        }
        return this.fallback || src;
    }
}
