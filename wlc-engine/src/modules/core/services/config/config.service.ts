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

  public async load(): Promise<any> {
    return this.data.request({
      name: 'botostrap',
      system: 'config',
      url: '/api/v1/bootstrap',
      type: 'GET',
      preload: 'bootstrap',
      mapFunc: (res) => this.prepareData(res),
    }).toPromise();
  }

  public get(key: string) {
    return this.$data[key];
  }

  protected prepareData(response: IData): AppConfigModel {
    this.$data = new AppConfigModel(response);
    this.$resolve();
    return this.$data;
  }
}
