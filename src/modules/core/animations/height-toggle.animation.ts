import {trigger, state, style, transition, animate} from '@angular/animations';

export const HeightToggleAnimation = [
    trigger('toggle', [
        state('opened', style({
            height: '*',
            opacity: 1,
        })),
        state('closed', style({
            height: '0px',
            opacity: 0,
        })),
        transition('* => *', [
            animate('0.3s'),
        ]),
    ]),
];
