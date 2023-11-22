import {Ng2StateDeclaration} from '@uirouter/angular';

export const providersState: Ng2StateDeclaration = {
    url: '/providers',
};

export const providersItemState: Ng2StateDeclaration = {
    url: '/:provider',
};
