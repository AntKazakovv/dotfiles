import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LogService {

    constructor() {}
    /**
     * dummy method to log. should be implemented later
     * @param logObject 
     */
    public sendLog(logObject: any): void {
        console.log('sendLog', logObject);
    }
}
