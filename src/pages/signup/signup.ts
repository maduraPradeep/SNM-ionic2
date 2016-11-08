import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import {DoctorService} from '../../providers/doctors-data';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: {username?: string, password?: string,firstname?:string,lastname?:string,email?:string,hospital?:string,speciality?:string,name?:string} = {};
  submitted = false;
  isDoctor=false;

  constructor(public navCtrl: NavController, public userData: UserData,public doctorService:DoctorService) {}

  onSignup(form,isDoctor) {
    this.submitted = true;

    if (form.valid) {
     // this.userData.signup(this.signup);
      this.doctorService.signup(this.signup).then(res=>{
      console.log(res);
      });
     // this.navCtrl.push(TabsPage);
    }
  }
}
