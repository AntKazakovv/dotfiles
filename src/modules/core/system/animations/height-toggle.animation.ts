import {trigger, state, style, transition, animate} from '@angular/animations';

export const HeightToggleAnimation = [
    trigger('toggle', [
        state('opened', style({
            height: '*',
            paddingTop: '*',
            paddingBottom: '*',
            opacity: 1,
            overflow: 'initial',
        })),
        state('closed', style({
            height: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            opacity: 0,
            overflow: 'hidden',
        })),

        transition('opened <=> closed', [
            animate((() => 300)()),
        ]),
    ]),
];
