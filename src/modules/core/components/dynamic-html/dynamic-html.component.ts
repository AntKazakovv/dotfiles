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
    template: '',
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
        const domParser = new DOMParser();
        const dynamicComponent = Component({
            template: domParser.parseFromString(html, 'text/html')?.querySelector('body')?.innerHTML,
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

    ngOnDestroy() {
        if (this.componentReference) {
            this.componentReference.destroy();
        }
    }
}
