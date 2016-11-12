import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ReportService} from '../../providers/reports-data';
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
  reports=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,public reportService: ReportService) {
    this.patient = navParams.data;
  }

  ionViewDidLoad() {
    console.log('Hello PatientDetails Page');
  }
  ngAfterViewInit() {
    this.getReports();
  }

  getReports() {
    this.reportService.filter(this.patient['id']).then(data=> {
      console.log(data);
      this.reports = data;
    });
  };
}
