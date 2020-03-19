import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {single} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';

import {APP_ENVIRONMENT, IAppEnv} from 'tokens';

import {
    isArray as _isArray,
    get as _get
} from 'lodash';

export enum RequestMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE'
}

export interface IRequest {
    method: string;
    endpoint: string;
    params?: any;
}

@Injectable()
export class DataService {

    constructor(
        private http: HttpClient,
        @Inject(APP_ENVIRONMENT) protected env: IAppEnv,
    ) {
    }

    public request<T>(request: IRequest): Observable<T> {
        const url: string = _get(this.env, 'site', '') + '/' + request.endpoint;
        const httpRequest = this.http.request(request.method as string, url, {
            params: request.params,
            withCredentials: true
        });
        return httpRequest.pipe(single()) as Observable<T>;
    }

    private getParamsString(data: any): string {
        return JSON.stringify(data);
    }
}
