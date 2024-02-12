import {
    trigger,
    state,
    style,
    transition,
    animate,
    AnimationTriggerMetadata,
} from '@angular/animations';

export const enum TriggerNamesEnum {
    OPENED = 'opened',
    CLOSED = 'closed',
};

export const HeightToggleAnimation: AnimationTriggerMetadata[] = [
    trigger('toggle', [
        state(TriggerNamesEnum.OPENED, style({
            height: '*',
            paddingTop: '*',
            paddingBottom: '*',
            opacity: 1,
            overflow: 'initial',
        })),
        state(TriggerNamesEnum.CLOSED, style({
            height: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            opacity: 0,
            overflow: 'hidden',
        })),

        transition(`${TriggerNamesEnum.OPENED} <=> ${TriggerNamesEnum.CLOSED}`, [
            animate((() => 300)()),
        ]),
    ]),
];
