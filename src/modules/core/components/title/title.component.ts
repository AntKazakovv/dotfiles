import {RawParams} from '@uirouter/core';

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './title.params';
import * as Interfaces from './title.interfaces';

import _isString from 'lodash-es/isString';
import {IContextTitle} from './title.interfaces';

@Component({
    selector: '[wlc-title]',
    templateUrl: './title.component.html',
    styleUrls: ['./styles/title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent extends AbstractComponent implements OnInit, AfterViewInit {
    public override $params: Interfaces.ITitleCParams;
    public ready: boolean = false;

    @Input() public mainTag: Interfaces.TagType;
    @Input() public secondTag: Interfaces.TagType;
    @Input() public mainLink: string;
    @Input() public mainParams: RawParams;
    @Input() public mainShowTitleLink: boolean;

    @Input() protected mainText: Interfaces.TextType;
    @Input() protected secondText: Interfaces.TextType;
    @Input() protected type: Interfaces.Type;
    @Input() protected inlineParams: Interfaces.ITitleCParams;

    @ViewChild('div', {static: false}) divTemplate: TemplateRef<IContextTitle>;
    @ViewChild('link') linkTemplate: TemplateRef<IContextTitle>;
    @ViewChild('h1') h1Template: TemplateRef<IContextTitle>;
    @ViewChild('h2') h2Template: TemplateRef<IContextTitle>;
    @ViewChild('span') spanTemplate: TemplateRef<IContextTitle>;

    constructor(
        @Inject('injectParams') protected params: Interfaces.ITitleCParams,
    ) {
        super(
            <IMixedParams<Interfaces.ITitleCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.prepareParams();

        this.subscribeChanges();
    }

    public ngAfterViewInit(): void {
        this.ready = true;
        this.cdr.detectChanges();
    }

    public get $mainText(): string {
        return this.getText('mainText');
    }

    public get $secondText(): string {
        return this.getText('secondText');
    }

    public getTemplateRef(name: string): TemplateRef<IContextTitle> {
        switch (name) {
            case 'h1':
                return this.h1Template;
            case 'h2':
                return this.h2Template;
            case 'span':
                return this.spanTemplate;
            default:
                return this.mainShowTitleLink ? this.linkTemplate : this.divTemplate;
        }
    }

    protected prepareParams(): void {
        if (!this.mainText) {
            this.mainText = this.$params.mainText;
        }
        if (!this.secondText) {
            this.secondText = this.$params.secondText;
        }
        if (!this.mainTag) {
            this.mainTag = this.$params.common.mainTag;
        }
        if (!this.secondTag) {
            this.secondTag = this.$params.common.secondTag;
        }
    }

    protected subscribeChanges(): void {
        if (this.mainText instanceof BehaviorSubject) {
            this.mainText.pipe(takeUntil(this.$destroy)).subscribe(() => {
                this.cdr.markForCheck();
            });
        }
        if (this.secondText instanceof BehaviorSubject) {
            this.secondText.pipe(takeUntil(this.$destroy)).subscribe(() => {
                this.cdr.markForCheck();
            });
        }
    }

    protected getText(type: Interfaces.varTextType): string {
        const text = (type === 'mainText') ? this.mainText : this.secondText;
        if (_isString(text)) {
            return text;
        } else if (text instanceof BehaviorSubject) {
            return text.getValue();
        }
    }
}
