declare namespace jasmine {
    interface Matchers {
        toBeImplemented<T = unknown>(data: T): boolean;
    }
}
