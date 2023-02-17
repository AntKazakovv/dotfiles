import {TemplateRef, Type} from '@angular/core';

export type TDialogStatus = 'created' | 'opening' | 'opened' | 'hiding' | 'hidden';
export type TDialogCloseReason = 'confirm' | 'close' | 'backdrop' | 'service' | 'component' | string;

export interface IDialogParams<T = any> {
    headerText?: string;
    showFooter?: boolean;
    showClose?: boolean;
    closeByBackdrop?: boolean;
    dialogClasses?: string;

    content?: string;

    component?: Type<any>
    componentParams?: T;

    templateRef?: TemplateRef<any>;
    templateParams?: T;
};
