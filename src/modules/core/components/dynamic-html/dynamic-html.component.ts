import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    Output,
    ViewContainerRef,
    EventEmitter,
    ChangeDetectionStrategy,
    Type,
    inject,
    Renderer2,
    NgZone,
    DestroyRef,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {
    BehaviorSubject,
    distinctUntilChanged,
    fromEvent,
} from 'rxjs';

import {
    ConfigService,
    RouterService,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {components} from 'wlc-engine/modules/core/core.module';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {DomSanitizerService} from 'wlc-engine/modules/core/system/services/dom-sanitizer/dom-sanitizer.service';
import {ParallaxMovementDirective} from 'wlc-engine/modules/core/directives/parallax-movement.directive';

@Component({
    selector: '[wlc-dynamic-html]',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicHtmlComponent implements AfterViewInit {
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

    protected readonly viewContainerRef = inject<ViewContainerRef>(ViewContainerRef);
    protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    protected readonly domSanitizerService = inject<DomSanitizerService>(DomSanitizerService);
    protected readonly renderer = inject<Renderer2>(Renderer2);
    protected readonly configService = inject<ConfigService>(ConfigService);
    protected readonly routerService = inject<RouterService>(RouterService);
    protected readonly window = inject<Window>(WINDOW);
    protected readonly ngZone = inject<NgZone>(NgZone);
    protected readonly destroyRef = inject<DestroyRef>(DestroyRef);

    public ngAfterViewInit(): void {
        try {
            this.init();
        } catch (error: unknown) {
            this.parseAsPlainHTML = true;
            throw new Error(`${error}`);
        }
    }

    private init(): void {
        if (!this.html) {
            return;
        }

        if (this.shouldClearStyles) {
            this.html = this.html.replace(/style=["'][^"']*["']/gi, '');
        }

        if (this.withoutCompilation) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', this.getHtml());
            return;
        }

        const template: string = this.getSerializeHtml();
        this.renderTemplate(template);

        // find all wlc- components
        const componentNames: string[] = [...new Set(template.match(/wlc-[\w-]*/g))].filter(
            // @ts-ignore no-implicit-any #672571
            (componentName: string): boolean => !!components[componentName],
        );

        if (componentNames.length) {
            componentNames.forEach((componentName: string): void => {
                this.createComponent(componentName, this.elementRef.nativeElement);
            });
        }

        const parallaxElement: HTMLElement = this.elementRef.nativeElement.querySelector('[wlc-parallax]');
        const wlcLinkElements: NodeListOf<Element> = this.elementRef.nativeElement.querySelectorAll('[wlc-link]');
        const authElements: NodeListOf<Element> = this.elementRef.nativeElement.querySelectorAll('[auth]');

        if (parallaxElement) {
            this.initWlcParallax();
        }

        if (wlcLinkElements.length) {
            this.initWlcLinkDirective(wlcLinkElements);
        }

        if (authElements.length) {
            this.initAuthDirective(authElements);
        }

        this.htmlRendered.emit();

        if (this.canUseScriptTag) {
            this.createScriptElements();
        }
    }

    /**
     * @param {string} template - The template to render.
     * @returns {void}
     * @private
     */
    private renderTemplate(template: string): void {
        const elementDiv: HTMLElement = this.renderer.createElement(`${this.tag || 'div'}`);
        this.renderer.setProperty(elementDiv, 'innerHTML', template);
        this.renderer.addClass(elementDiv, 'ng-star-inserted');
        this.renderer.setAttribute(elementDiv, 'wlc-dynamic', '');
        this.renderer.appendChild(this.elementRef.nativeElement, elementDiv);
    }

    /**
     * Creates a dynamic component based on the provided HTML element.
     * @param {string} componentName - Name of the component.
     * @param {HTMLElement} templateElement - Template element.
     * @returns {void}
     * @private
     */
    private createComponent(componentName: string, templateElement: HTMLElement): void {
        // get component
        // @ts-ignore no-implicit-any #672571
        const component = components[componentName];

        if (!component) {
            return;
        }

        const selectors = [
            `[${componentName}]`,
            `${componentName}`,
        ];
        const wlcElements: NodeList = templateElement.querySelectorAll(selectors.join(','));

        if (!wlcElements?.length) {
            return;
        }

        wlcElements.forEach((element: HTMLElement): void => {
            const customElement: HTMLElement = this.createCustomElement(element, component);
            element.replaceWith(customElement);
        });
    }

    /**
     * Creates a custom HTML element based on the provided component and element.
     * @param element The HTML element to create a custom element for.
     * @param component The component to use for the custom element.
     * @returns {HTMLElement} The created custom HTML element.
     * @private
     */
    private createCustomElement(
        element: HTMLElement,
        component: Type<unknown>,
    ): HTMLElement {
        // children node of real html element
        const childNodes = Array.from(element.childNodes);

        // create current component reference
        const currentComponentRef = this.viewContainerRef.createComponent(component,
            {projectableNodes: [childNodes]});
        const {nativeElement} = currentComponentRef.location;

        const attributes = Array.from(element.attributes);

        if (attributes.length && nativeElement) {

            for (let i = 0; i < attributes.length; i++) {
                const attribute: Attr = attributes[i];

                if (!attribute.value) {
                    continue;
                }

                const attributeName = attribute.name.replace(/[*\[\]]/g, '');
                const isAttributeValueToObject = ['event', 'inline'].includes(attributeName);
                let attributeValue: string | Object | boolean = attribute.value;

                if (isAttributeValueToObject) {
                    const attributeValueJson = attribute.value
                        .replace(/'/g, '"')
                        .replace(/([$A-Z_a-z][\w$]*)\s*:/g, '"$1":');
                    attributeValue = JSON.parse(attributeValueJson);
                }

                // @ts-ignore no-implicit-any #672571
                currentComponentRef.instance[attributeName] = attributeValue;

                // clone attribute
                this.renderer.setAttribute(nativeElement, attributeName, attribute.value);
            }
        }

        currentComponentRef.changeDetectorRef.detectChanges();

        return nativeElement;
    }

    /**
     * Prepares the component template by extracting the body content and replacing brackets.
     * @param template The template to prepare.
     * @returns {string} The prepared template.
     * @private
     */
    private getSerializeHtml(): string {
        const html = this.getHtml();
        const dom = new DOMParser().parseFromString(html, 'text/html');
        const serializedDom = this.extractBodyFromString(new XMLSerializer().serializeToString(dom));
        return GlobalHelper.replaceBrackets(serializedDom);
    }

    /**
     * Creates script elements from the HTML content of the component.
     * @returns {void} The processed HTML content.
     * @private
     */
    private createScriptElements(): void {
        const html = new DOMParser().parseFromString(this.html, 'text/html');
        const scripts = html.querySelectorAll('script');

        scripts.forEach(script => {
            const element = this.renderer.createElement('script');

            const attributes: Attr[] = Array.from(script.attributes);
            attributes.forEach((attribute: Attr): void => {
                this.renderer.setAttribute(element, attribute.name, attribute.value);
            });

            const content = this.renderer.createText(script.textContent);
            this.renderer.appendChild(element, content);
            this.renderer.appendChild(this.elementRef.nativeElement, element);
        });
    }

    /**
     * Returns the HTML content of the component, processed according to the current settings.
     * @returns {string} The processed HTML content.
     * @private
     */
    private getHtml(): string {
        const html = this.parseAsPlainHTML
            ? GlobalHelper.parseHtmlSafely(this.html)
            : this.html;

        const sanitizedHtml = this.safeHtmlMode
            ? this.domSanitizerService.sanitizeHtml(this.extractBodyFromString(html))
            : this.extractBodyFromString(html);

        return GlobalHelper.replaceBrackets(sanitizedHtml);
    }

    /**
     * Extracts the content of the `<body>` element from a given HTML string.
     * If the HTML string does not contain a `<body>` element, the original string is returned.
     * @param html The HTML string to extract the body content from.
     * @returns {string} The extracted body content, or the original HTML string if no `<body>` element is found.
     * @private
     */
    private extractBodyFromString(html: string): string {
        const bodyMatch = html.match(/<body.*?>(.*?)<\/body>/s);
        return bodyMatch ? bodyMatch[1] : html;
    }

    /**
     * Extracts the content of the HTML body from a given string.
     * @param html The input HTML string.
     * @returns {void} The content of the HTML body, or the original string if no body tag is found.
     * @private
    */
    private initAuthDirective(authElements: NodeListOf<Element>): void {
        const isAuth$$ = this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$');

        isAuth$$.pipe(
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((isAuth: boolean): void => {
            authElements.forEach((element: Element): void => {
                const isAuthAttribute = element.getAttribute('auth');

                if (isAuth && isAuthAttribute === 'true') {
                    this.renderer.setStyle(element, 'display', 'block');
                }

                if (!isAuth && isAuthAttribute === 'false') {
                    this.renderer.setStyle(element, 'display', 'none');
                }
            });
        });
    }



    /**
     * Initializes the WLC link directive by finding all elements with the 'wlc-link' attribute
     * and adding a click event listener to navigate to the specified state.
     * @returns {void}
     * @private
     */
    private initWlcLinkDirective(wlcLinkElements: NodeListOf<Element>): void {
        wlcLinkElements.forEach((linkElement: Element): void => {

            this.ngZone.runOutsideAngular(() => {
                const state = linkElement.getAttribute('wlc-link');

                fromEvent(linkElement, 'click')
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe(() => {
                        this.routerService.navigate(state);
                    });
            });
        });

    }

    /**
     * Initializes the WLC parallax directive by selecting elements with the 'wlc-parallax' attribute
     * and creating a new instance of ParallaxMovementDirective for them. Calls `ngAfterViewInit`
     * on the directive to set up the necessary parallax effects.
     * @returns {void}
     * @private
     */
    private initWlcParallax(): void {
        const parallaxDirective = new ParallaxMovementDirective(
            this.elementRef,
            this.window.document,
            this.window,
            this.ngZone,
        );
        parallaxDirective.ngAfterViewInit();
    }
}
