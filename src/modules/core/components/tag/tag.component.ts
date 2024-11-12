import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    Renderer2,
    ElementRef,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './tag.params';

@Component({
    selector: '[wlc-tag]',
    templateUrl: './tag.component.html',
    styleUrls: ['./styles/tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TagComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input('inline') protected inlineParams: Params.ITagCParams;
    @Input('theme') public theme: Params.ComponentTheme;

    public override $params: Params.ITagCParams;
    protected tagConfig: Params.ITagCommon;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITagCParams,
        protected renderer: Renderer2,
        private hostRef: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);

        if (changes.inlineParams?.currentValue?.common) {
            this.tagConfig = changes.inlineParams.currentValue.common;

            if (this.tagConfig.bg) {
                this.renderer.setStyle(this.hostRef.nativeElement, '--wlc-tag-bg', this.tagConfig.bg, 2);
            }
        }
    }
}
