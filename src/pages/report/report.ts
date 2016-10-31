import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Report page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  constructor(public navCtrl: NavController) {}
  report: {report_name?: string, report_type?: string,description?:string,param_1?:number,param_2?:string,date?:string} = {};
  submitted = false;

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      //this.userData.login(this.login.username);
     // this.navCtrl.push(TabsPage);
    }
  }
  submitReport(report){

  }
}
