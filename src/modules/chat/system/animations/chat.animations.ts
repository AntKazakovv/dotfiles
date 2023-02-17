import {
    animation,
    animate,
    transition,
    trigger,
    style,
} from '@angular/animations';

export const fadeInUpTrigger = trigger('scaleInUp', [
    transition(':enter', [
        animation([
            style({
                opacity: 0,
                transform: 'translateY(10px) scale(0.98)',
            }),
            animate('0.2s ease-out', style({
                transform: '*',
                opacity: 1,
            })),
        ]),
    ]),
    transition(':leave', [
        animation([
            animate('0.15s ease-in', style({
                transform: 'translateY(10px) scale(0.98)',
                opacity: 0,
            })),
        ]),
    ]),
]);
