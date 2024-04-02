import {
    ChangeDetectorRef,
    EmbeddedViewRef,
    Pipe,
    PipeTransform,
    Type,
    inject,
} from '@angular/core';

@Pipe({
    name: 'functionPurePipe',
    pure: true,
})
export class FunctionPurePipe implements PipeTransform {

    private cdr = inject(ChangeDetectorRef) as EmbeddedViewRef<Type<unknown>>;

    public transform<T extends (...args: unknown[]) => any>(func: T, args: Parameters<T>): ReturnType<T> {
        return func.apply(this.cdr.context, args);
    }
}
