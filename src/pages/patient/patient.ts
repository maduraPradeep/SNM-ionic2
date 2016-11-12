import {Component} from '@angular/core';

import {
  App,
  NavController,
  AlertController
} from 'ionic-angular';

import {PatientService} from '../../providers/patient-data';
import { PatientDetailsPage } from '../patient-details/patient-details';
import {AuthService} from "../../providers/auth-service";
@Component({
  selector: 'page-patient',
  templateUrl: 'patient.html'
})
export class PatientPage {
  queryText = '';
  patients = [];
  user:any;

  constructor(public app: App,
              public navCtrl: NavController,
              public patientService: PatientService,
              private alertCtrl: AlertController,private authService:AuthService) {
      this.user=this.authService.getProfile();

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
      let code="1234";
      this.patientService.requestOTP(patient,this.user,function(err,res){

          if(err) {

          }else {
              code=res.SMS.toString();
              let alert = ctx.alertCtrl.create({
                  title: 'Enter OTP',
                  inputs: [
                      {
                          name: 'code',
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
                              console.log(data.code===code);
                               if(data.code===code) {
                              ctx.navCtrl.push(PatientDetailsPage, patient);
                               }else{
                                   console.log("Invalid code");
                               }
                          }
                      }
                  ]
              });
              alert.present();
          }
      });

    /*this.patientService.requestOTP(patient,this.user, function (err, response) {
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
*/
  }
}
