import {Component} from '@angular/core';

import {
  App,
  NavController,
  AlertController
} from 'ionic-angular';

import {PatientService} from '../../providers/patient-data';
import { PatientDetailsPage } from '../patient-details/patient-details';
@Component({
  selector: 'page-patient',
  templateUrl: 'patient.html'
})
export class PatientPage {
  queryText = '';
  patients = [];

  constructor(public app: App,
              public navCtrl: NavController,
              public patientService: PatientService,
              private alertCtrl: AlertController) {

  }

  ionViewDidEnter() {
    this.app.setTitle('Patients');
  }

  ngAfterViewInit() {
    this.getPatients();
  }

  getPatients() {
    this.patientService.search(this.queryText).then(data=> {
      console.log(data);
      return this.patients = data;
    });
  };

  requestAccess(patient) {
    var ctx=this;
    this.patientService.requestOTP(patient, function (err, response) {
      if (err) {

      } else {
        let alert = ctx.alertCtrl.create({
          title: 'Enter OTP',
          inputs: [
            {
              name: 'Access code',
              placeholder: 'Enter access code'
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'View',
              handler: data => {
                console.log(data);
                ctx.navCtrl.push(PatientDetailsPage, patient);
              }
            }
          ]
        });
        alert.present();
      }
    });

  }
}
