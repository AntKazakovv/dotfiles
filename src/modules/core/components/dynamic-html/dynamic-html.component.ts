import {
    AfterViewInit,
    Compiler,
    Component,
    ComponentRef,
    Injector,
    Input,
    NgModule,
    NgModuleRef,
    OnDestroy,
    ViewContainerRef,
} from '@angular/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {GlobalHelper} from 'wlc-engine/modules/core';

@Component({
    selector: '[wlc-dynamic-html]',
    templateUrl: './dynamic-html.component.html',
})
export class DynamicHtmlComponent implements AfterViewInit, OnDestroy {
    @Input() protected html: string;

    private componentReference: ComponentRef<any>;

    constructor(
        public viewRef: ViewContainerRef,
        private compiler: Compiler,
        private injector: Injector,
        private moduleRef: NgModuleRef<any>,
    ) {
    }

    ngAfterViewInit(): void {
        this.createComponentFromRaw(GlobalHelper.parseHtmlSafely(this.html));
    }

    private createComponentFromRaw(html: string) {
        const dynamicComponent = Component({
            template: this.cleanHtml(html),
            selector: '[wlc-dynamic]',
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
            });
    }

    private cleanHtml(html: string): string {
        const domParser = new DOMParser();
        const parseHtml = domParser.parseFromString(html, 'text/html')?.querySelector('body');
        const elements = parseHtml.getElementsByTagName('*');
        let resultHtml = "";
        for (let i=0; i<elements.length; i++) {
            if (!(elements[i] instanceof HTMLUnknownElement)) {
                if (elements[i].childNodes) {
                    this.cleanChild(elements[i].childNodes);
                }
                resultHtml += elements[i].outerHTML;
            }
        }
        return resultHtml;
    }

    protected cleanChild(elements: NodeListOf<ChildNode>): NodeListOf<ChildNode> {
        for (let i=0; i<elements.length; i++) {
            if (elements[i] instanceof HTMLUnknownElement) {
                elements[i].remove();
            } else {
                if (elements[i].childNodes) {
                    this.cleanChild(elements[i].childNodes);
                }
            }
        }
        return elements;
    }

    ngOnDestroy() {
        if (this.componentReference) {
            this.componentReference.destroy();
        }
    }
}
