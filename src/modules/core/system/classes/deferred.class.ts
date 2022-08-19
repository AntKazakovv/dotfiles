'use strict';

interface IPromise<T> extends Promise<T> {
    finally: (handler: Function) => IPromise<T>;
}

type TDeferredStatus = 'resolved' | 'rejected' | 'pending';

export class Deferred<T> {
    promise: IPromise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;

    public status: TDeferredStatus = 'pending';

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = (value) => {
                this.status = 'resolved';
                resolve(value);
            };
            this.reject = (reason) => {
                this.status = 'rejected';
                reject(reason);
            };
        }) as IPromise<T>;
    }
}
