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
    @Input() public parseAsPlainHTML: boolean;
    @Input() public tag: string;
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
        this.createComponentFromRaw();
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
            });
    }

    private extractBodyFromString(html: string): string {
        return html.match(/<body.*?>(.*?)<\/body>/s)?.[1] || html;
    }

    ngOnDestroy() {
        if (this.componentReference) {
            this.componentReference.destroy();
        }
    }
}
