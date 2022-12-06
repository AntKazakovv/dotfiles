import {
    animate,
    query,
    stagger,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';

export const BurgerPanelAppearanceAnimations = [
    trigger('innerAppearance', [
        state('close', style({opacity: 0})),
        transition('* => fade-open', [
            animate('0.3s 0.3s ease-in', style({
                opacity: 1,
            })),
        ]),
        transition('* => fade-stagger-open', [
            style({opacity: 1}),
            query(':scope > div > div, .container > div', [
                style({opacity: 0}),
                stagger('0.07s', animate('0.35s 0.1s linear', style({
                    opacity: 1,
                }))),
            ], {optional: true}),
        ]),
        transition('* => translate-stagger-default-open', [
            style({opacity: 1}),
            query(':scope > div > div, .container > div', [
                style({
                    opacity: 0,
                    transform: 'translateY(-10px)',
                }),
                stagger('0.07s', animate('0.3s 0.25s ease-in', style({
                    opacity: 1,
                    transform: 'translateY(0)',
                }))),
            ], {optional: true}),
        ]),
        transition('* => translate-stagger-open', [
            style({opacity: 1}),
            query(':scope > div > div, .container > div', [
                style({
                    opacity: 0,
                    transform: 'translateY(10px)',
                }),
                stagger('0.1s', animate('0.35s 0.2s ease-out', style({
                    opacity: 1,
                    transform: 'translateY(0)',
                }))),
            ], {optional: true}),
        ]),
        transition('* => scale-stagger-open', [
            style({opacity: 1}),
            query(':scope > div > div, .container > div', [
                style({
                    opacity: 0.3,
                    transform: 'scale(0.98)',
                }),
                stagger('0.07s', animate('0.3s 0.2s ease-out', style({
                    opacity: '*',
                    transform: '*',
                }))),
            ], {optional: true}),
        ]),
        transition('* => close', [
            query(':scope > div > div, .container > div', [
                animate('0.2s ease-in', style({opacity: 0})),
            ], {optional: true}),
        ]),
        transition('expanded <=> compact', [
            style({
                opacity: 0,
                transform: 'translateY(30px)',
            }),
            animate('0.25s 0.45s ease-out', style({
                opacity: 1,
                transform: 'translateY(0)',
            })),
        ]),
    ]),
];
