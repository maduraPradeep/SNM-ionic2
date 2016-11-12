import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ReportService} from "../../providers/reports-data";
import {AuthService} from "../../providers/auth-service";

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
    report: {report_name?: string, report_type?: string,description?:string,param_1?:number,param_2?:string,date?:string,patient_id?:string} = {};
    submitted = false;
  constructor(public navCtrl: NavController,public reportService:ReportService,public authService:AuthService) {
      let user=this.authService.getProfile();
      this.report.patient_id=user['user_id'];
  }


  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      //this.userData.login(this.login.username);
     // this.navCtrl.push(TabsPage);
    }
  }
  submitReport(report){

this.reportService.addReport(report).then(res=>{
  console.log(res);
});
  }
}
