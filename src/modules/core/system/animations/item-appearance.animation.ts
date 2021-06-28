import {
    trigger,
    style,
    transition,
    animate,
} from '@angular/animations';

export const ItemAppearanceAnimation = [
    trigger('appearance', [
        transition('void => useAnim', [
            style({opacity: 0}),
            animate('0.8s', style({opacity: 1})),
        ]),
    ]),
];
