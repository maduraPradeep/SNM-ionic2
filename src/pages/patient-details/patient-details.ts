import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
 Generated class for the PatientDetails page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-patient-details',
  templateUrl: 'patient-details.html'
})
export class PatientDetailsPage {
  patient: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.patient = navParams.data;
  }

  ionViewDidLoad() {
    console.log('Hello PatientDetails Page');
  }

}
