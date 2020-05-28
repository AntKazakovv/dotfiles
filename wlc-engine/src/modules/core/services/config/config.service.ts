import {Injectable} from '@angular/core';
import {DataService} from '../data/data.service';
import {tap} from 'rxjs/operators';
import {AppConfigModel} from './app-config.model';

@Injectable()
export class ConfigService {

  public ready: Promise<void> = new Promise((resolve) => {
    this.$resolve = resolve;
  });

  private $data: AppConfigModel;
  private $resolve: any;

  constructor(
    private data: DataService
  ) {
  }

  public load() {
    return this.data.request({
      name: 'botostrap',
      system: 'config',
      url: '/api/v1/bootstrap',
      type: 'GET',
    }).pipe(tap((response) => {
      if (response.status === 'success') {
        this.$data = new AppConfigModel(response.data);
        this.$resolve();
      }
    })).toPromise();
  }

  public get(key: string) {
    return this.$data[key];
  }
}
