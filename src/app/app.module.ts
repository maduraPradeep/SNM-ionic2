import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ConferenceApp } from './app.component';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SchedulePage } from '../pages/channel/channel';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { ReportPage } from '../pages/report/report';
import { PatientPage } from '../pages/patient/patient';
import { ConferenceData } from '../providers/conference-data';
import { DoctorService } from '../providers/doctors-data';
import { UserData } from '../providers/user-data';
import { PatientService } from '../providers/patient-data';
import { PatientDetailsPage } from '../pages/patient-details/patient-details';
import { ReportService } from '../providers/reports-data';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AuthService } from '../providers/auth-service';
import { Http } from '@angular/http';
import {DoctorApprovePage} from '../pages/doctor-approve/doctor-approve';

let storage: Storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}


@NgModule({
  declarations: [
    ConferenceApp,
    AccountPage,
    LoginPage,
    SchedulePage,
    SignupPage,
    TabsPage,
    ReportPage,
    PatientPage,
    PatientDetailsPage,
    DoctorApprovePage
  ],
  imports: [
    IonicModule.forRoot(ConferenceApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AccountPage,
    LoginPage,
    SchedulePage,
    SignupPage,
    TabsPage,
    ReportPage,
    PatientPage,
    PatientDetailsPage,
    DoctorApprovePage
  ],
  providers: [ConferenceData, UserData, Storage,DoctorService,PatientService,ReportService,AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    }]
})
export class AppModule {}
