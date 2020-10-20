import {TemplateRef, QueryList} from '@angular/core';
import {NgTemplateNameDirective} from 'wlc-engine/modules/core/directives/template-name/template-name.directive';

export class GlobalHelper {

    public static gettext<T>(content: T): T {
        return content;
    }

    public static getTemplates(templates: string[]): string {
        return ((): string => {
            return templates.join('');
        })();
    }

    public static deepFreeze<T>(target: T): T {
        Object.freeze(target);

        Object.getOwnPropertyNames(target).forEach((prop: string): void => {
            if (target.hasOwnProperty(prop)
                && target[prop] !== null
                && (typeof target[prop] === 'object' || typeof target[prop] === 'function')
                && !Object.isFrozen(target[prop])
            ) {
                this.deepFreeze(target[prop]);
            }
        });

        return target;
    }

    public static getTemplateByName(templatesList: QueryList<NgTemplateNameDirective>, name: string) {
        // console.log(templatesList);
        // const dir = templatesList.find((template: NgTemplateNameDirective) => template.name === name);
        // return dir ? dir.template : null;
    }
}
