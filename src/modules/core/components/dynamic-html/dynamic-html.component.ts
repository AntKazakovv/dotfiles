import {
    AfterViewInit,
    Compiler,
    Component,
    ComponentRef,
    ElementRef,
    Inject,
    Injector,
    Input,
    NgModule,
    NgModuleRef,
    OnDestroy,
    ViewContainerRef,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {GlobalHelper} from 'wlc-engine/modules/core';

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
        this.createComponentFromRaw();
    }

    public ngOnDestroy(): void {
        if (this.componentReference) {
            this.componentReference.destroy();
        }
    }

    private createComponentFromRaw(): void {
        const html = this.parseAsPlainHTML
            ? GlobalHelper.parseHtmlSafely(this.html)
            : this.html;

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
                this.componentReference.changeDetectorRef.markForCheck();
            }).then(() => {
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

    private extractBodyFromString(html: string): string {
        return html.match(/<body.*?>(.*?)<\/body>/s)?.[1] || html;
    }
}
