import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import {DoctorService} from '../../providers/doctors-data';
import {PatientService} from "../../providers/patient-data";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: {user_name?: string, password?: string,first_name?:string,last_name?:string,email?:string,hospital?:string,speciality?:string,name?:string,mobile?:string,nic?:string} = {};
  submitted = false;
  isDoctor=false;

  constructor(public navCtrl: NavController, public doctorService:DoctorService,public patientService:PatientService) {}

  onSignup(form,isDoctor) {
    this.submitted = true;

    if (form.valid) {
     // this.userData.signup(this.signup);
      if(isDoctor) {
        this.doctorService.signup(this.signup).then(res=> {
          console.log(res);
          this.navCtrl.push(LoginPage);
        });
      }else{
        this.patientService.signup(this.signup).then(res=>{
          console.log(res);
          this.navCtrl.push(LoginPage);
        });
      }
     // this.navCtrl.push(TabsPage);
    }
  }
}
