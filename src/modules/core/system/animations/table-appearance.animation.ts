import {
    trigger,
    query,
    style,
    transition,
    animate,
    stagger,
} from '@angular/animations';

export const TableAppearanceAnimation = [
    trigger('tableAppearance', [
        transition('* <=> *', [
            query(':enter', [
                style({
                    opacity: 0,
                    transform: 'translateY(-15px)',
                }),
                stagger('0.05s', animate('0.2s ease-out',
                    style({
                        opacity: 1,
                        transform: 'translateY(0)',
                    }),
                )),
            ], {optional: true}),
        ]),
    ]),
];
