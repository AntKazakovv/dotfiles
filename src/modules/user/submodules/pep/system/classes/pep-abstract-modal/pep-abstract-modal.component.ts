import {
    Directive,
    Inject,
    OnInit,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {
    fromEvent,
    Subscription,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _set from 'lodash-es/set';

import {
    AbstractComponent,
    IComponentParams,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {
    PepEventKind,
    PepModalId,
    PepService,
} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {WlcModalComponent} from 'wlc-engine/modules/core/components/modal/modal.component';


@Directive()
export abstract class PepAbstractModalComponent extends AbstractComponent implements OnInit {
    protected abstract readonly modalId: PepModalId;
    protected abstract readonly cancellingEvent: PepEventKind;

    protected closeWindow$: Subscription;

    constructor(
        @Inject(WINDOW) protected window: Window,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected pepService: PepService,
        mixedParams: IMixedParams<unknown>,
    ) {
        super(mixedParams);
    }

    public ngOnInit(inlineParams?: IComponentParams<unknown, unknown, unknown>): void {
        super.ngOnInit(inlineParams);

        this.cancelStatusOnHidden();
        this.cancelStatusOnPageClosed();
    }

    public abstract ngSubmit(form: UntypedFormGroup): Promise<boolean>;

    protected cancelStatusOnHidden(): void {
        const modal = this.getModal();

        if (modal) {
            _set(modal, '$params.config.onModalHide', () => {
                if (this.shouldStatusBeCanceled(modal.closeReason)) {
                    this.pepService.fireEvent(this.cancellingEvent);
                }
            });

            this.eventService.subscribe(
                {name: this.cancellingEvent},
                () => this.modalService.hideModal(this.modalId),
                this.$destroy,
            );
        }
    }

    protected cancelStatusOnPageClosed(): void {
        this.closeWindow$ = fromEvent(this.window, 'beforeunload')
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => this.pepService.fireEvent(this.cancellingEvent));
    }

    protected getModal(): WlcModalComponent | null {
        return this.modalService.getActiveModal(this.modalId)?.ref?.instance ?? null;
    }

    protected goBackOnHidden(goBackToModalId: PepModalId): void {
        const modal = this.getModal();

        if (modal) {
            modal.goBack = async () => {
                modal.closeReason = 'goBack';
                this.modalService.closeAllModals();

                await this.modalService.showModal(goBackToModalId);
                modal.closeReason = '';
            };
        }
    }

    protected shouldStatusBeCanceled(reason: string): boolean {
        return reason === 'closeIcon';
    }

    protected unsubscribeFromCancelingOnClosePage(): void {
        this.closeWindow$?.unsubscribe();
    }
}
