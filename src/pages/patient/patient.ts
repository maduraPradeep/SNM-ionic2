import {Component} from '@angular/core';

import {
  App,
  NavController,
  ActionSheet,
  ActionSheetController,
  AlertController, AlertController
} from 'ionic-angular';

import {PatientService} from '../../providers/patient-data';

@Component({
  selector: 'page-patient',
  templateUrl: 'patient.html'
})
export class PatientPage {
  queryText = '';
  patients = [];
  actionSheet: ActionSheet;

  constructor(public app: App,
              public navCtrl: NavController,
              public patientService: PatientService,
              public actionSheetCtrl: ActionSheetController,
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
    let alert = this.alertCtrl.create({
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
            console.log("TODO: Validate");

          }
        }
      ]
    });
    alert.present();
  }
}
