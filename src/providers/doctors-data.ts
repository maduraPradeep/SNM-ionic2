/**
 * Created by Madura on 06/10/2016.
 */
import {Injectable} from '@angular/core';

import {Storage} from '@ionic/storage';
import {Http,Headers} from '@angular/http';
import {AuthService} from "./auth-service";

@Injectable()
export class DoctorService {
  data: any;
  filter: any;
  apiUrl:any;
    storage: Storage = new Storage();
  constructor(public http: Http,public authService:AuthService) {
      this.apiUrl= "http://localhost:8280/doctor/1.0.0/";
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
        this.storage.get('doctors').then(doctor => {
            if(doctor) {
                console.log(doctor);
                this.data = JSON.parse(doctor);
                resolve(this.data);
            }else{
                this.http.get('assets/data/doctors.json').subscribe(res => {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    this.data = res.json();
                    this.storage.set('doctors',JSON.stringify(this.data));
                    resolve(this.data);
                });
            }
        }).catch(error => {
            console.log(error);
        });

    });
  }

  signup(userObj) {
    /*  let headers = new Headers();
    this.createAuthorizationHeader(headers);
      let url=this.apiUrl+'signup';
    return new Promise(resolve => {
      this.http.post(url,JSON.stringify(userObj),{headers:headers}).subscribe(res => {
        resolve(res.json());
      })
    });*/
      let auth0User={"connection":"Username-Password-Authentication","email":userObj.email,"username":userObj.namename,"password":userObj.password,"user_metadata":{},"email_verified":false,"app_metadata":{"roles":["doctor"]},"name":userObj.name};
      return new Promise(resolve => {
          this.authService.signup(auth0User).then(res=>{
console.log(res);
              this.load().then(data=> {
                  userObj.speciality = [userObj.speciality];
                  userObj.profile_pic = "https://cdn4.iconfinder.com/data/icons/icoflat-2/512/avatar-64.png";
                  userObj.availability = "9.00 a.m. - 5 p.m.";
                  userObj.verified = "false";
                  userObj.id =res['user_id'];
                  this.data.push(userObj);
                  this.updateStorage();
                  console.log(userObj);
                  resolve(userObj);
              });
          });

      });
  }
  search(queryText = '') {
    return this.filterData(this.filter).then(data => {
      console.log("Query text:" + queryText);
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
        console.log(data);
      if (filter)
        return data.filter((item)=> {
          return item[filter.key] === filter.value;
        });
      else return this.data;
    });
  }

  loadPendingList(){
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      let url=this.apiUrl+'pending';
      console.log(url);
      return new Promise(resolve => {
          this.http.get(url,{headers:headers}).subscribe(res => {
              resolve(res.json());
          })
      });
  }
  updateStorage(){
      this.storage.set('doctors', JSON.stringify(this.data));
  }

  approve(doctor){
      /*let headers = new Headers();
      this.createAuthorizationHeader(headers);
      let url=this.apiUrl+doctor+'/approve';
      return new Promise(resolve => {
          this.http.post(url,{},{headers:headers}).subscribe(res => {
              resolve(res);
          })
      });*/
     return new Promise(resolve => {
         this.load().then(doctors=> {
             doctors.forEach(item=> {
                 if(item.id === doctor.id){
                     item.verified="true";
                     this.updateStorage();
                     resolve(this.data);
                 }
             });
         });
     });
  }
}
