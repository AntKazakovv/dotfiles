import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    Renderer2,
    ElementRef,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './tag.params';

@Component({
    selector: '[wlc-tag]',
    templateUrl: './tag.component.html',
    styleUrls: ['./styles/tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TagComponent extends AbstractComponent implements OnInit {
    @Input('inline') protected inlineParams: Params.ITagCParams;

    public override $params: Params.ITagCParams;
    protected tagConfig: Params.ITagCommon;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITagCParams,
        protected override configService: ConfigService,
        protected renderer: Renderer2,
        private hostRef: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.tagConfig = this.$params.common;

        if (this.tagConfig.bg) {
            this.renderer.setStyle(this.hostRef.nativeElement, '--wlc-tag-bg', this.tagConfig.bg, 2);
        }
    }
}
