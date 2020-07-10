import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'ng-template[name]'
})
export class NgTemplateNameDirective {
    @Input() name: string;

    constructor(public template: TemplateRef<any>) {
    }
}
