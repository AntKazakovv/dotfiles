import {
    IModalOptions,
    IModalType,
} from 'wlc-engine/modules/core';
import {
    ModalDirective,
    ModalOptions,
} from 'ngx-bootstrap/modal';

export abstract class AbstractModalComponent {
    $params: IModalOptions;
    modalDirect: ModalDirective;
    closeReason: string;
    bsOptions: ModalOptions;

    abstract get closed(): Promise<string>;
    abstract get ready(): Promise<void>;
    abstract get nativeElement(): Node;

    /**
     * A method that sets the closed state of the modal. Does not close the window itself, it is only used to put
     * the Promise object $closed in the Resolve state.
     */
    abstract setClosed(): void;

    /**
     * Closes the modal window
     * @param {string} modal Modal ID
     */
    abstract confirm(modal: string): void;

    /**
     * Closes the modal window
     * @param {string} modal Modal ID
     */
    abstract closeModal(modal: string): void;
    abstract setTitle(title: string): void;
    abstract getType(): IModalType;
    abstract goBack(): void;
    abstract closeModalByReason(reason: string): void;
}
