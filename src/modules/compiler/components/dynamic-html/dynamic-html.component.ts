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
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

import _each from 'lodash-es/each';

@Component({
    selector: '[wlc-dynamic-html]',
    templateUrl: './dynamic-html.component.html',
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
     * html to compile
     */
    @Input() protected html: string;

    @Output() protected htmlRendered = new EventEmitter<void>();

    private componentReference: ComponentRef<any>;

    constructor(
        public viewRef: ViewContainerRef,
        @Inject(DOCUMENT) private document: HTMLDocument,
        private compiler: Compiler,
        private injector: Injector,
        private moduleRef: NgModuleRef<CoreModule>,
        private elementRef: ElementRef,
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
            this.elementRef.nativeElement.innerHTML = this.extractBodyFromString(this.getHtml());
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
        const html = this.getHtml();
        const dynamicComponent = Component({
            template: this.extractBodyFromString(html),
            selector: `${this.tag || 'div'}[wlc-dynamic]`,
        })(class {
            public window = window;

            ngOnInit() {
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
        return this.parseAsPlainHTML
            ? GlobalHelper.parseHtmlSafely(this.html)
            : this.html;
    }

    private extractBodyFromString(html: string): string {
        return html.match(/<body.*?>(.*?)<\/body>/s)?.[1] || html;
    }
}
