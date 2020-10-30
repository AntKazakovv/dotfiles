import {Component, HostBinding, OnInit} from '@angular/core';

import {
    forEach as _forEach,
    map as _map,
} from 'lodash';


interface IBonusTmp {
    id: number,
    chosen: boolean,
    type: string,
    icon: string,
    sale: string
    description?: string
    text?: string
}

@Component({
    selector: '[wlc-signup-bonus]',
    templateUrl: './signup-bonus.component.html',
    styleUrls: ['./signup-bonus.component.scss'],
})
export class SignupBonusComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-signup-bonus';

    public bonuses: IBonusTmp[] = [
        {
            id: 1,
            chosen: false,
            type: 'bonus-1',
            icon: '/static/dist/bonus-1.svg',
            sale: '50',
            description: 'VIP Slots Bonus 50% up to $1,000',
            text: 'Wagering requirements - times 15 (x15) deposit plus bonus',
        },
        {
            id: 2,
            chosen: false,
            type: 'bonus-2',
            icon: '/static/dist/bonus-2.svg',
            sale: '100',
            description: 'Slots Bonus 100$ up to $1,000',
            text: 'Deposit plus bonus',
        },
        {
            id: 3,
            chosen: false,
            type: 'bonus-3',
            icon: '/static/dist/bonus-3.svg',
            sale: '150',
            description: 'Slots Bonus 150$ up to $1,000',
            text: 'Deposit plus bonus',
        },
        {
            id: 4,
            chosen: false,
            type: 'bonus-1',
            icon: '/static/dist/bonus-1.svg',
            sale: '100',
            description: 'VIP Slots Bonus 50% up to $1,000',
            text: 'Wagering requirements - times 15 (x15) deposit plus bonus',
        },
        {
            id: 5,
            chosen: false,
            type: 'bonus-1',
            icon: '/static/dist/bonus-1.svg',
            sale: '100',
            description: 'VIP Slots Bonus 50% up to $1,000',
            text: 'Wagering requirements - times 15 (x15) deposit plus bonus',
        },
        {
            id: 6,
            chosen: false,
            type: 'bonus-2',
            icon: '/static/dist/bonus-2.svg',
            sale: '50',
            description: 'Slots Bonus 100$ up to $1,000',
            text: 'Deposit plus bonus',
        },
        {
            id: 7,
            chosen: false,
            type: 'bonus-3',
            icon: '/static/dist/bonus-3.svg',
            sale: '150',
            description: 'Slots Bonus 150$ up to $1,000',
            text: 'Deposit plus bonus',
        },
        {
            id: 8,
            chosen: false,
            type: 'empty',
            icon: '',
            sale: '',
        },
    ];
    public chosenBonus: IBonusTmp;

    constructor() {
    }

    ngOnInit(): void {
    }

    public onClose() {
        console.log('close event');
    }

    public choseBonus(chosenBonus: IBonusTmp): void {
        _forEach(this.bonuses, (bonus) => {
            if (chosenBonus.id === bonus.id) {
                this.chosenBonus = chosenBonus;
                bonus.chosen = true;
            } else {
                bonus.chosen = false;
            }
        });
    }

    public setAsideClass(): string {
        return this.chosenBonus ? this.chosenBonus.type : '';
    }
}
