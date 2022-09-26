/*
class works with the main preloader of the application. If the bootstrap response was bad, we call
the setMainError method, if everything is fine, we just remove the loader from html, and if the application
loader is too long, we show a message that there is something wrong with the connected
*/
/* eslint-disable no-restricted-globals */
import {IIndexing} from './../../modules/core/system/interfaces/global.interface';

export class PreloaderLogo {
    public error: boolean = false;

    protected translatesLoaded: Promise<void> = new Promise((resolve: () => void) => {
        this.$resolveTranslates = resolve;
    });
    protected $resolveTranslates: () => void;
    protected timerId: ReturnType<typeof setTimeout>;
    protected app: HTMLElement | null;
    protected preloader: HTMLElement | null;
    protected content: HTMLElement | null;
    protected textsBlock: HTMLElement;
    protected lang: string;
    protected translates: IIndexing<string>;
    protected observer: MutationObserver;

    constructor() {
        setTimeout((): void => {
            this.init();
        });
    }

    /**
     * on bootrstrap request success
     */
    public setSuccess(): void {
        this.observer.disconnect();
    }

    protected async init(): Promise<void> {
        this.lang = document.documentElement.lang || 'en';
        this.timerId = setTimeout((): void => {
            this.initMainElements();
            this.setLoadingErrors();
        }, 25000);

        this.initMainElements();
        this.setObserver();

        try {
            const baseUrl: string = '/static/languages/';
            const phrases: string[] = ['preloader_button', 'preloader_loading__1', 'preloader_loading__2',
                'preloader_loading__3', 'preloader_error__1', 'preloader_error__2', 'preloader_error__3'];

            let isThereTranslate: boolean = true;

            const response: IIndexing<string> = await fetch(`${baseUrl}${this.lang}.json`).then(res => res.json());
            const keysPhrases: string[] = Object.keys(response);

            for (const phrase of phrases) {
                isThereTranslate = keysPhrases.includes(phrase);

                if (!isThereTranslate) {
                    break;
                }
            }

            if (isThereTranslate) {
                this.translates = response;
            } else {
                this.translates = await fetch(`${baseUrl}en.json`).then(res => res.json());
            }

            this.$resolveTranslates();
        } catch (error) {
            console.error('error in PreloaderLogo during fetching translates', error);
        }
    }

    /**
     * set errors and add refresh btn
     */
    protected async setMainError(): Promise<void> {
        await this.translatesLoaded;
        clearTimeout(this.timerId);

        if (this.app && this.preloader && this.content) {
            this.app.appendChild(this.preloader);
            this.content.innerHTML = '';
            const imageLogo: HTMLElement = this.createElement('img', 'wlc-app__preload-image_error');
            this.content.appendChild(imageLogo);
            this.content.appendChild(this.textsBlock);

            this.setMainErrorsTexts();
            this.addRefreshButton();
        }
    }

    protected initMainElements(): void {
        if (this.app && this.preloader && this.content) {
            return;
        }

        this.app = document.querySelector('.wlc-app');
        this.preloader = document.querySelector('.wlc-app__preload');
        this.content = document.querySelector('.wlc-app__preload-content');

        if (this.content) {
            this.textsBlock = this.createElement('div', 'wlc-app__preload-text_block');
            this.content.appendChild(this.textsBlock);
        }
    }

    /**
     * add refresh button in error on bootstrap request
     */
    protected addRefreshButton(): void {
        if (this.content) {
            const button = this.createElement(
                'button',
                'wlc-app__preload-button',
                this.translates[gettext('preloader_button')],
            );
            this.content.appendChild(button);
            button.addEventListener('click', () => window.location.reload());
        }
    }

    /**
     * set text error in main loader on loading
     */
    protected async setLoadingErrors(): Promise<void> {
        await this.translatesLoaded;

        if (this.textsBlock) {
            this.textsBlock.innerHTML = `
                <h5 class="wlc-app__preload-title">${this.translates[gettext('preloader_loading__1')]}</h5>
                <p class="wlc-app__preload-text">${this.translates[gettext('preloader_loading__2')]}</p>
                <p class="wlc-app__preload-text">${this.translates[gettext('preloader_loading__3')]}</p>
            `;
        }
    }

    /**
     * set text error in main loader on error bootstrap
     */
    protected setMainErrorsTexts(): void {
        if (this.textsBlock) {
            this.textsBlock.innerHTML = `
                <p class="wlc-app__preload-text">503</p>
                <p class="wlc-app__preload-text">${this.translates[gettext('preloader_error__1')]}</p>
                <p class="wlc-app__preload-text">${this.translates[gettext('preloader_error__2')]}</p>
                <p class="wlc-app__preload-text">${this.translates[gettext('preloader_error__3')]} ${Date.now()}</p>
            `;
        }
    }

    protected createElement(tagName: string, className: string, textContent: string = ''): HTMLElement {
        const element: HTMLElement = document.createElement(tagName);
        element.classList.add(className);
        element.textContent = textContent;
        return element;
    }

    protected setObserver(): void {
        this.observer = new MutationObserver((mutations: MutationRecord[]) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length && this.error) {
                    this.setMainError();
                    this.observer.disconnect();

                    break;
                }
            }
        });

        if (this.app) {
            this.observer.observe(this.app, {childList: true});
        }
    }
}

Object.assign(window, {WlcPreloaderLogo: new PreloaderLogo()});
