import {trigger, query, style, transition, animate, stagger} from '@angular/animations';

export const ListAppearanceAnimation = [
    trigger('appearance', [
        transition('*<=>*', [
            query(':enter', [
                style({opacity: 0}),
                stagger('0.03s', animate('0.8s', style({opacity: 1}))),
            ], {optional: true}),
        ]),
    ]),
];
