import { Component } from '@angular/core';
import { App,NavController} from 'ionic-angular';
import {DoctorService} from '../../providers/doctors-data';
/*
  Generated class for the DoctorApprove page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-doctor-approve',
  templateUrl: 'doctor-approve.html'
})
export class DoctorApprovePage {
  doctors = [];
  constructor(public app: App,public navCtrl: NavController,public doctorService: DoctorService) {}

  ionViewDidLoad() {
    this.app.setTitle('Approve Doctors');
    console.log('Hello DoctorApprove Page');
  }
  ngAfterViewInit() {
    this.doctorService.filterData({"key":"verified","value":"false"}).then(data=> {
      console.log(data);
      return this.doctors = data;
    });
  }
  approve(doctor){

  }

}
