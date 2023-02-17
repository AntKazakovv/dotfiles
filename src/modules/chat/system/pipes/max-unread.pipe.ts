import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'maxUnread'})
export class MaxUnreadPipe implements PipeTransform {
    transform(value: number): string {
        return value > 99 ? '99+' : String(value);
    }
}
