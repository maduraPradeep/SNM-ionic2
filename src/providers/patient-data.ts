/**
 * Created by Madura on 10/10/2016.
 */
import {Injectable} from '@angular/core';


import {Http} from '@angular/http';
@Injectable()
export class PatientService {
  data: any;

  constructor(public http: Http) {
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
      this.http.get('assets/data/patient.json').subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = res.json();
        resolve(this.data);
      });
    });
  }

  search(queryText = '') {
    return this.load().then(data => {
      console.log("Query text:"+queryText)
      if (queryText&& queryText !== '') {
        queryText=queryText.toLowerCase();
        return data.filter((item) => {
          return (item.first_name.toLowerCase().indexOf(queryText) > -1)||(item.last_name.toLowerCase().indexOf(queryText) > -1);
        })
      }else{
        return data;
      }
    });

  }

  getApproval(){

  }
  requestOTP(patient){
    console.log("Sending otp...");
  }
}
