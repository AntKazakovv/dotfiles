import {
    animate,
    query,
    style,
    stagger,
    trigger,
    transition,
} from '@angular/animations';

export const CardLoadingAnimation = [
    trigger('cardLoading', [
        transition('*<=>*', [
            query('.wlc-games-grid__item:enter .wlc-game-thumb', [
                style({
                    opacity: 0,
                    transform: 'translateY(25px)',
                }),
                stagger('0.05s',
                    animate(
                        '0.3s ease-out',
                        style({
                            opacity: 1,
                            transform: 'translateY(0)',
                        })),
                ),
            ], {
                optional: true,
            }),
        ]),
    ]),
];
