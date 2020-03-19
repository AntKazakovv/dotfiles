import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {DataService} from '../../services/data/data.service';

interface IBootsrapData {
    version: string;
    country: string;
    country2: string;
    env: string;
}

@Injectable()
export class AppProvider {

    constructor(
        private dataService: DataService
    ) { }

    public async bootstrap(): Promise<any> {
        return this.dataService.request<IBootsrapData>({
            method: 'GET',
            endpoint: 'api/v1/bootstrap'
        }).toPromise();
    }
}
