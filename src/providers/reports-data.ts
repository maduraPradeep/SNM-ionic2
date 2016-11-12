import {Injectable} from '@angular/core';

import {Storage} from '@ionic/storage';

import {Http} from '@angular/http';
@Injectable()
export class ReportService {
  data: any;
    apiUrl:string;
    storage: Storage = new Storage();
  constructor(public http: Http) {
      this.apiUrl='http://irham2531-patient-report.wso2apps.com/services/report_DataService/';
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }
      return new Promise(resolve => {
          this.storage.get('reports').then(report => {
              if (report) {
                  console.log(report);
                  this.data = JSON.parse(report);
                  resolve(this.data);
              } else {
                  this.http.get('assets/data/reports.json').subscribe(res => {
                      this.data = res.json();
                      this.storage.set('reports', JSON.stringify(this.data));
                      resolve(this.data);
                  });
              }
          }).catch(error => {
              console.log(error);
          });
      });
  }

  addReport(report){
      report.report_id=(Math.floor(Math.random()*1000)).toString();
      return new Promise(resolve => {
          this.load().then(data=> {
              this.data.push(report);
              this.storage.set('reports', JSON.stringify(this.data));
              resolve(this.data);
          });
      });
      /*let url=this.apiUrl+"insert";
      //let headers = new Headers();
      //this.createAuthorizationHeader(headers);
      let insertRequest= {
          "_postinsert": report
      };
      console.log(insertRequest);
      return new Promise(resolve => {
          this.http.post(url,JSON.stringify(insertRequest)).subscribe(res => {
              resolve(res);
          })
      });*/


  }
  filter(patientId){
      return this.load().then(data=>{
          console.log("PatientId:"+patientId);
            return data.filter((item) => {
                return item.patient_id===patientId;
             });
         });
  }
}
