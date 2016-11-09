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
this.load();

  }

  load(){
      this.doctorService.loadPendingList().then(data=> {
          console.log(data);
          try {
              this.doctors=[];
              let nameList = data['pending']['doctors'];
              if (nameList)
                  this.doctors = (nameList instanceof Array ? nameList : [nameList]) || [];
          }catch(err){
              console.log(err);
          }
          return data;
      });
  }
  approve(doctor){
this.doctorService.approve(doctor).then(data=>{
    console.log(data);
    this.load();
});
  }

}
