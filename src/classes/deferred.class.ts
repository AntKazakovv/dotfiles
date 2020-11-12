'use strict';

interface IPromise<T> extends Promise<T> {
    finally: (handler: Function) => IPromise<T>;
}

export class Deferred<T> {
    promise: IPromise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject:  (reason?: any) => void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject  = reject;
        }) as IPromise<T>;
    }
}
