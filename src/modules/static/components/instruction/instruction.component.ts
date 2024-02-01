import {
    Component,
    Inject,
    OnInit,
    ViewContainerRef,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Renderer2,
} from '@angular/core';

import {
    ConfigService,
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './instruction.params';

@Component({
    selector: '[wlc-instruction]',
    templateUrl: './instruction.component.html',
    styleUrls: ['./styles/instruction.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionComponent extends AbstractComponent implements OnInit {
    @ViewChild('wrp', {read: ViewContainerRef, static: false}) wrp: ViewContainerRef;

    constructor(
        @Inject('injectParams') protected params: Params.IInstructionCParams,
        @Inject(WINDOW) protected window: Window,
        protected staticService: StaticService,
        protected viewRef: ViewContainerRef,
        protected renderer2: Renderer2,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super(<IMixedParams<Params.IInstructionCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
    }

    public onPostReady(): void {
        this.initWpElements();
    }

    protected initWpElements(): void {
        setTimeout(() => {
            if (this.wrp) {
                this.initWpAccordions();
            }
        });
    }

    protected initWpAccordions(): void {
        if (!this.window.isPlatformBrowser) {
            return;
        }

        this.wrp.element.nativeElement.querySelectorAll('.accordion').forEach((accordion: HTMLElement) => {
            const items = accordion.querySelectorAll('.accordion-item');

            items.forEach((item: HTMLElement) => {

                this.renderer2.listen(item, 'click', (e) => {
                    const currentTarget = e.currentTarget as Element;

                    items.forEach((item: HTMLElement) => {
                        if (item !== e.currentTarget) {
                            item.classList.remove('active');
                        }
                    });
                    currentTarget.classList.toggle('active');

                    if (currentTarget.classList.contains('active')) {
                        currentTarget.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest',
                        });
                    }
                });
            });
        });
    }
}
