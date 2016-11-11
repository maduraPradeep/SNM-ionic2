import {Injectable} from '@angular/core';


import {Http} from '@angular/http';
@Injectable()
export class ReportService {
  data: any;
    apiUrl:string;

  constructor(public http: Http) {
      this.apiUrl='http://irham2531-patient-report.wso2apps.com/services/report_DataService/';
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('assets/data/reports.json').subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = res.json();
        resolve(this.data);
      });
    });
  }

  addReport(report){
      let url=this.apiUrl+"insert";
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
      });
  }
}
