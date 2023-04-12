import {
    Directive,
    Input,
    ViewContainerRef,
    TemplateRef,
} from '@angular/core';
class WlcLetContext<T> {
    constructor(
        private readonly internalDirectiveInstance: WlcLetDirective<T>,
    ) {}

    get $implicit(): T {
        return this.internalDirectiveInstance.wlcLet;
    }

    get wlcLet(): T {
        return this.internalDirectiveInstance.wlcLet;
    }
}

/**
 * A structural directive which do nothing, but allow to create local variable
 * without using *ngIf directive. Used to subscribe on observable ones an use
 * the result multiple times
 *
 * @example
 * <button *wlcLet="asyncSubject$ | async as asyncSubjectVar"
 *      [class.disabled]="asyncSubjectVar"
 *      [attr.disabled]="asyncSubjectVar"
 * >Whatever</button>
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[wlcLet]',
})
export class WlcLetDirective<T> {
    @Input() wlcLet!: T;

    constructor(
        viewContainer: ViewContainerRef,
        templateRef: TemplateRef<any>,
    ) {
        viewContainer.createEmbeddedView(templateRef, new WlcLetContext<T>(this));
    }

    static ngTemplateContextGuard<T>(
        _dir: WlcLetDirective<T>,
        _ctx: unknown,
    ): _ctx is WlcLetDirective<T> {
        return true;
    }
}
