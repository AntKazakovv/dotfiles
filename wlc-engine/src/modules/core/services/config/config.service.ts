import {Injectable} from '@angular/core';
import {DataService, IData} from '../data/data.service';
import {tap, map} from 'rxjs/operators';
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

  public async load(): Promise<AppConfigModel> {

    if ((window as any).wlcPreload?.bootstrap) {
      const response: IData = await (window as any).wlcPreload.bootstrap.request;
      return this.prepareData(response);
    } else {
      return this.data.request({
        name: 'botostrap',
        system: 'config',
        url: '/api/v1/bootstrap',
        type: 'GET',
      }).pipe(map((response) => {
        return this.prepareData(response);
      })).toPromise();
    }
  }

  public get(key: string) {
    return this.$data[key];
  }

  protected prepareData(response: IData): AppConfigModel {
    if (response.status === 'success') {
      this.$data = new AppConfigModel(response.data);
      this.$resolve();
      return this.$data;
    }
    return;
  }
}
