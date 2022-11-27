import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {ConnectionToken, View} from '@app/model';
import {User} from '@app/globals';
import {AppService, SettingService, HttpService} from '@app/services';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'elements-content-window',
  templateUrl: './content-window.component.html',
  styleUrls: ['./content-window.component.css']
})
export class ElementContentWindowComponent implements OnInit {
  @Input() view: View;
  @ViewChild('contentWindow', {static: true}) windowRef: ElementRef;
  connector: string; // koko, omnidb, lion
  token: ConnectionToken;
  loading = true;
  public id: string;

  constructor(private _settingSvc: SettingService,
              private _appSvc: AppService,
              private _http: HttpService,
              private _route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.id = 'window-' + Math.random().toString(36).substr(2);
    await this.computeConnector();
    this.createWaterMark();
    this.view.smartEndpoint = await this._appSvc.getSmartEndpoint(this.view);
    this.loading = false;
  }

  createWaterMark() {
    this._settingSvc.createWaterMarkIfNeed(
      this.windowRef.nativeElement,
      `${User.name}(${User.username})\n${this.view.asset.name}`
    );
  }

  async computeConnector() {
    const { asset, connectData } = this.view;
    const token = await this._http.createConnectToken(asset, connectData).toPromise();
    this.connector = connectData.connectMethod.component;
    this.token = token;
    this.view.token = token;
  }
}
