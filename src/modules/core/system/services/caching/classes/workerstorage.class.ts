import {DateTime} from 'luxon';
import {Subject} from 'rxjs';
import {first} from 'rxjs/operators';
import {AbstractCache} from './abstract.cache';

interface ICacheMessage<T> {
    rid: number;
    key: string;
    type: 'set' | 'get';
    status: 'success' | 'failed';
    value?: T;
    error?: unknown;
}

interface IWorkerRequest<T> {
    type: 'set' | 'get' | 'clear' | 'delete' | 'check';
    key?: string;
    rid?: number;
    value?: T;
    expiration?: number;
}

interface IWorkerCheckResponse {
    status: 'success' | 'failed';
}

export class WorkerStorageCache extends AbstractCache {

    private rid: number = 0;
    private worker: Worker;
    private worker$: Subject<ICacheMessage<unknown>> = new Subject();

    private $resolve: (result: boolean) => void;
    public isAvailable: Promise<boolean> = new Promise((resolve: (result: boolean) => void): void => {
        this.$resolve = resolve;
    });

    constructor(protected window: Window) {
        super();
        this.init();
    }

    private async init(): Promise<void> {
        if (this.window.indexedDB && typeof (Worker) !== 'undefined') {

            this.worker = new Worker(new URL('./cache.worker', import.meta.url), {type: 'module'});
            this.worker.onmessage = ({data}) => {
                try {
                    this.worker$.next(JSON.parse(data));
                } catch (error) {
                    //
                }
            };

            try {
                await this.workerRequest<IWorkerCheckResponse>({type: 'check'});
                this.$resolve(true);
            } catch (error) {
                this.$resolve(false);
            }
        }
    }

    public async get<T>(key: string): Promise<T> {
        try {
            return await this.workerRequest({
                type: 'get',
                key,
            });
        } catch (error) {
            return;
        }
    }

    public async set<T>(key: string, value: T, keepTime: number): Promise<T> {
        try {
            return await this.workerRequest({
                type: 'set',
                key,
                value,
                expiration: DateTime.local().plus(keepTime).toMillis(),
            });
        } catch (error) {
            return;
        }
    }

    public async delete(key: string): Promise<void> {
        try {
            await this.workerRequest({
                type: 'delete',
                key,
            });
        } catch (error) {
            //
        }
    }

    public async clear(): Promise<void> {
        try {
            await this.workerRequest({
                type: 'clear',
            });
        } catch (error) {
            //
        }
    }

    private async workerRequest<T>(request: IWorkerRequest<T>): Promise<T> {
        if (request.type !== 'check' && !await this.isAvailable) {
            return;
        }
        return new Promise((resolve, reject) => {
            request.rid = ++this.rid;
            this.worker$.pipe(first((message: ICacheMessage<T>) => {
                return message.rid === request.rid;
            })).subscribe((message) => {
                if (message.status === 'success') {
                    resolve(message.value);
                } else {
                    reject(message.error);
                }
            });
            this.worker.postMessage(request);
        });
    }
}
