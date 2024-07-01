import {
    trigger,
    style,
    animate,
    transition,
} from '@angular/animations';


export const openCloseAnimations = [
    trigger('openClose', [
        transition(':enter', [
            style({
                opacity: 0,
                height: 0,
                paddingBottom: 0,
            }),
            animate('0.2s', style({
                height: '*',
                paddingBottom: '*',
                opacity: 1,
            })),
        ]),
        transition(':leave', [
            animate('0.2s', style({
                opacity: 0,
                height: 0,
                paddingBottom: 0,
            })),
        ]),
    ]),
];
