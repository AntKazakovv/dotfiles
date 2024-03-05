import {
    Pipe,
    PipeTransform,
} from '@angular/core';

@Pipe({
    name: 'purePipe',
})
export class PurePipe implements PipeTransform {
    transform<T>(func: Function, args: unknown[]): T {
        return func(...args);
    }
}
