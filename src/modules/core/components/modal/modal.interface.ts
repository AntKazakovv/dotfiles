import {
    Type,
    ComponentRef,
    TemplateRef,
} from '@angular/core';
import {WlcModalComponent} from './index';
import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

/**
 * Modal options from bootstrap documentation
 */
export interface IModalBsOptions {
    /**
     * If `true`, the backdrop element will be created for a given modal.
     *
     * Alternatively, specify `'static'` for a backdrop which doesn't close the modal on click.
     *
     * Default value is `true`.
     */
    backdrop?: boolean | 'static';
    /**
     * If `true`, closes the modal when escape key is pressed
     */
    keyboard?: boolean;
    /**
     * If `true`, shows the modal when initialized
     */
    show?: boolean;
    /**
     * If `true`, puts the focus on the modal when initialized
     */
    focus?: boolean;
}

/**
 * Extended options for implementation
 */
export interface IModalConfig extends IModalBsOptions {
    /**
     * ID of modal window, also uses as mofificator for class `modal`
     */
    id: string;
    /**
     * Type of modal window, also uses as mofificator for class `modal`
     */
    modifier?: 'info' | 'confirmation' | 'error' | string;
    /**
     * Title. If title empty modal-header has class `no-title`
     */
    modalTitle?: string;
    /**
     * Allow to insert Component
     */
    component?: Type<unknown>;
    componentParams?: unknown;
    /**
     * Allow to insert TemplateRef
     */
    templateRef?: TemplateRef<unknown>;
    templateRefParams?: unknown;
    /**
     * Allow to insert html string
     */
    modalMessage?: string | string[];
    /**
     * Text of close button. `Close` by default
     */
    closeBtnText?: string;
    /**
     * Show confirm button. `false` by default
     */
    showConfirmBtn?: boolean;
    /**
     * Text of confirm button. `Confirm` by default
     */
    confirmBtnText?: string;
    /**
     * if false then hide modal footer
     */
    showFooter?: boolean;
    /**
     * Action by click on confirm button. Modal closes after it.
     */
    onConfirm?: () => void;
    /**
     * Close all modals before render
     */
    dismissAll?: boolean;

    /**
     * If `true`, modal opening and closing will be animated.
     */
    animation?: boolean;

    /**
     * If `true`, the modal will be centered vertically.
     */
    centered?: boolean;

    /**
     * Scrollable modal content (false by default).
     */
    scrollable?: boolean;

    /**
     * Size of a new modal window.
     */
    size?: 'sm' | 'lg' | 'xl' | string;

    /**
     * show.bs.modal
     */
    onModalShow?: () => any;

    /**
     * shown.bs.modal
     */
    onModalShown?: () => any;

    /**
     * hide.bs.modal
     */
    onModalHide?: () => any;

    /**
     * hidden.bs.modal
     */
    onModalHidden?: () => any;

    /**
     * hidePrevented.bs.modal
     */
    onModalHidePrevented?: () => any;
}

/**
 * Available string types of modals (`id`)
 */
export type IModalName = 'baseInfo' | 'faq' | 'search' | 'login' | 'signup' | string;

/**
 * List of default modals. `id` must be equal with `content.id`
 */
export interface IModalList {
    [id: string]: IModalOptions;
}

export type ModalTheme = 'default';
export type ModalType = 'default';
/**
 * Modal window params
 */
export interface IModalOptions extends IComponentParams<ModalTheme, ModalType, string> {
    /**
     * Describe modal configuration
     */
    config?: IModalConfig;
}

/**
 * List of events based on Bootstrap 5.0 documentation
 */
export interface IModalEvents {
    /**
     * `show.bs.modal` This event fires immediately when the show instance method is called.
     * If caused by a click, the clicked element is available as
     * the relatedTarget property of the event.
     */
    MODAL_SHOW: string;

    /**
     * `shown.bs.modal` This event is fired when the modal has been made visible
     * to the user (will wait for CSS transitions to complete).
     * If caused by a click, the clicked element is available as the relatedTarget
     * property of the event.
     */
    MODAL_SHOWN: string;

    /**
     * `hide.bs.modal` This event is fired immediately when the hide instance method has been called.
     */
    MODAL_HIDE: string;

    /**
     * `hidden.bs.modal` This event is fired when the modal has finished being hidden
     * from the user (will wait for CSS transitions to complete).
     */
    MODAL_HIDDEN: string;

    /**
     * `hidePrevented.bs.modal` This event is fired when the modal is shown, its backdrop is static
     * and a click outside the modal or an escape key press is performed with
     * the keyboard option or data-keyboard set to false.
     */
    MODAL_HIDE_PREVENTED: string;
}

/**
 * Active modal instance
 */
export interface IActiveModal {
    id: string;
    ref: ComponentRef<WlcModalComponent>;
}

