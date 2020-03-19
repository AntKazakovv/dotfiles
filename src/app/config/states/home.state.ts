import {Ng2StateDeclaration} from '@uirouter/angular';
import {HomeComponent} from 'modules/core/base/components/home/home.component';

export const homeState: Ng2StateDeclaration = {
    name: 'app.home',
    url: '',
    component: HomeComponent,
};
