import {
    AfterViewInit,
    Compiler,
    Component,
    ComponentRef,
    ElementRef,
    Inject,
    Injector,
    Input,
    Output,
    NgModule,
    NgModuleRef,
    OnDestroy,
    ViewContainerRef,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import _each from 'lodash-es/each';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {DomSanitizerService} from 'wlc-engine/modules/core/system/services/dom-sanitizer/dom-sanitizer.service';

@Component({
    selector: '[wlc-dynamic-html]',
    templateUrl: './dynamic-html.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicHtmlComponent implements AfterViewInit, OnDestroy {
    /**
     * if true - enable sanitize dom by DomParser
     */
    @Input() public parseAsPlainHTML: boolean;
    /**
     * if true - html puts via innerHTML without angular compilation;
     */
    @Input() public withoutCompilation: boolean;
    /**
     * Remove inline styles from html string;
     */
    @Input() public shouldClearStyles: boolean;
    /**
     * change wrapper html tag, by default - div
     */
    @Input() public tag: string;
    /**
     * if true - enable manual script tag add to component
     */
    @Input() public canUseScriptTag: boolean = false;
    /**
     * Using sanitizer for html security (but <style> tags allowed)
     */
    @Input() public safeHtmlMode: boolean = true;
    /**
     * html to compile
     */
    @Input() protected html: string;

    @Output() protected htmlRendered = new EventEmitter<void>();

    private componentReference: ComponentRef<any>;

    constructor(
        public viewRef: ViewContainerRef,
        @Inject(DOCUMENT) private document: Document,
        private compiler: Compiler,
        private injector: Injector,
        private moduleRef: NgModuleRef<CoreModule>,
        private elementRef: ElementRef,
        private domSanitizerService: DomSanitizerService,
    ) {
    }

    public ngAfterViewInit(): void {
        if (!this.html) {
            return;
        }

        if (this.shouldClearStyles) {
            this.html = this.html.replace(/style=["'][^"']*["']/gi, '');
        }

        if (this.withoutCompilation) {
            this.elementRef.nativeElement.innerHTML = this.getHtml();
        } else {
            try {
                this.createComponentFromRaw();
            } catch {
                this.parseAsPlainHTML = true;
                this.createComponentFromRaw();
            }
        }
    }

    public ngOnDestroy(): void {
        if (this.componentReference) {
            this.componentReference.destroy();
        }
    }

    private createComponentFromRaw(): void {
        const template: string = this.getHtml();
        const dynamicComponent = Component({
            template: this.prepareComponentTemplate(template),
            selector: `${this.tag || 'div'}[wlc-dynamic]`,
        })(class {
            ngOnInit(): void {
            }
        });

        const dynamicModule = NgModule({
            imports: [CoreModule],
            declarations: [dynamicComponent],
        })(class {
        });

        this.compiler.compileModuleAndAllComponentsAsync(dynamicModule)
            .then((factories) => {
                const f = factories.componentFactories[0];
                this.componentReference = f.create(this.injector, [], null, this.moduleRef);
                this.componentReference.instance.name = 'my-dynamic-component';
                this.viewRef.clear();
                this.viewRef.insert(this.componentReference.hostView);
                this.componentReference.changeDetectorRef.detectChanges();
            }).then(() => {
                this.htmlRendered.emit();
                if (this.canUseScriptTag) {
                    this.createScriptElements();
                }
            });
    }

    private prepareComponentTemplate(template: string): string {
        const html = this.extractBodyFromString(new XMLSerializer().serializeToString(
            new DOMParser().parseFromString(template, 'text/html'),
        ));
        return GlobalHelper.replaceBrackets(html);
    }

    private createScriptElements(): void {
        const html = new DOMParser().parseFromString(this.html, 'text/html');

        _each(html.querySelectorAll('script'), (script) => {
            const element = this.document.createElement('script');
            _each(script.attributes, (attribute) => {
                element.attributes.setNamedItem(<Attr>attribute.cloneNode());
            });
            const content = this.document.createTextNode(script.textContent);
            element.appendChild(content);
            this.elementRef.nativeElement.appendChild(element);
        });
    }

    private getHtml(): string {
        let html = this.parseAsPlainHTML
            ? GlobalHelper.parseHtmlSafely(this.html)
            : this.html;

        html = this.safeHtmlMode
            ? this.domSanitizerService.sanitizeHtml(this.extractBodyFromString(html))
            : this.extractBodyFromString(html);

        return GlobalHelper.replaceBrackets(html);
    }

    private extractBodyFromString(html: string): string {
        return html.match(/<body.*?>(.*?)<\/body>/s)?.[1] || html;
    }
}
