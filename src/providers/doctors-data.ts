/**
 * Created by Madura on 06/10/2016.
 */
import {Injectable} from '@angular/core';


import {Http,Headers} from '@angular/http';
@Injectable()
export class DoctorService {
  data: any;
  filter: any;
  apiUrl: "https://localhost:8243/doctor/1.0.0/";

  constructor(public http: Http) {
  }
    createAuthorizationHeader(headers:Headers) {
        headers.append('Authorization','Bearer 4ceae6ae-587e-33f9-a603-d768cdaea67a');
        headers.append('Content-Type','application/json');
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
      this.http.get('assets/data/doctors.json').subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = res.json();
        resolve(this.data);
      });
    });
  }

  signup(userObj) {
      let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return new Promise(resolve => {
      this.http.post('http://localhost:8280/doctor/1.0.0/signup',JSON.stringify(userObj),{headers:headers}).subscribe(res => {
        resolve(res.json());
      })
    });
  }
  search(queryText = '') {
    return this.filterData(this.filter).then(data => {
      console.log("Query text:" + queryText)
      if (queryText && queryText !== '') {
        queryText = queryText.toLowerCase();
        return data.filter((item) => {
          return (item.name.toLowerCase().indexOf(queryText) > -1) || (item.hospital.toLowerCase().indexOf(queryText) > -1) || (item.speciality.join().toLowerCase().indexOf(queryText) > -1);
        })
      } else {
        return data;
      }
    });

  }

  setFilter(filter) {
    this.filter = filter;
  }

  filterData(filter) {
    return this.load().then(data=> {
      if (filter)
        return data.filter((item)=> {
          return item[filter.key] === filter.value;
        });
      else return this.data;
    });
  }
}
