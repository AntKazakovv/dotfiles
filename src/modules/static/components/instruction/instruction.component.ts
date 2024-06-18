import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    inject,
    NgZone,
    Renderer2,
    ElementRef,
} from '@angular/core';

import {
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

    protected readonly ngZone = inject(NgZone);
    protected readonly rnd = inject(Renderer2);
    protected readonly host = inject(ElementRef);
    protected readonly window = inject(WINDOW) as Window;
    protected readonly staticService = inject(StaticService);

    constructor(
        @Inject('injectParams') protected params: Params.IInstructionCParams,
    ) {
        super(<IMixedParams<Params.IInstructionCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.ngZone.runOutsideAngular(() => {
            this.rnd.listen(this.host.nativeElement, 'click', (event: PointerEvent): void => {
                this.accordionHandlers(event.target as Element);
            });
        });
    }

    protected accordionHandlers(currentTarget: Element): void {
        if (currentTarget.classList.contains('accordion-item__title')) {
            const clickedItem = currentTarget.closest('.accordion-item');
            const accordion = clickedItem.closest('.accordion');
            const activeItem = accordion.querySelector('.accordion-item.active');

            if (activeItem && activeItem !== clickedItem) {
                activeItem.classList.remove('active');
            }

            clickedItem.classList.toggle('active');

            if (clickedItem.classList.contains('active')) {
                clickedItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                });
            }
        }
    }
}
