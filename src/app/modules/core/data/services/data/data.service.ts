import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  constructor() { }

  public testRequest(): string {
      return 'start request';
  }
}
