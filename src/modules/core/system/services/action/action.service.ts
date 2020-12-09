import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ActionService {

    constructor() {}

    public scrollTo(selector: string): void {
        setTimeout(() => {
            const element = selector ?
                document.querySelector(selector) :
                document.querySelector('body');

            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }, 0);
    }
}
