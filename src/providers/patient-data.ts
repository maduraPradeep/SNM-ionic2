/**
 * Created by Madura on 10/10/2016.
 */
import {Injectable} from '@angular/core';


import {Http,Headers} from '@angular/http';
import {AuthService} from "./auth-service";
import {Storage} from '@ionic/storage';
@Injectable()
export class PatientService {
  data: any;
    storage: Storage = new Storage();
    otpApiUrl:string;
  constructor(public http: Http,public authService:AuthService) {
      this.otpApiUrl="https://gateway.api.cloud.wso2.com:443/t/irham2531/send/1.0/services/twilioRest";
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }
      return new Promise((resolve,reject) => {
          // We're using Angular Http provider to request the data,
          // then on the response it'll map the JSON data to a parsed JS object.
          // Next we process the data and resolve the promise with the new data.
          this.storage.get('patients').then(patient => {
              if(patient) {
                  console.log(patient);
                  this.data = JSON.parse(patient);
                  resolve(this.data);
              }else{
                  this.http.get('assets/data/patient.json').subscribe(res => {
                      // we've got back the raw data, now generate the core schedule data
                      // and save the data for later reference
                      this.data = res.json();
                      this.storage.set('patients',JSON.stringify(this.data));
                      resolve(this.data);
                  });
              }
          }).catch(error => {
              console.log(error);
          });

      });
  }

  search(queryText = '') {
    return this.load().then(data => {
      console.log("Query text:" + queryText)
      if (queryText && queryText !== '') {
        queryText = queryText.toLowerCase();
        return data.filter((item) => {
          return (item.first_name.toLowerCase().indexOf(queryText) > -1) || (item.last_name.toLowerCase().indexOf(queryText) > -1);
        })
      } else {
        return data;
      }
    });

  }

  getApproval() {

  }
    createHeaders(headers:Headers) {
        headers.append('accept','application/json');
        headers.append('Content-Type','application/json');
        headers.append('Authorization','Bearer eee171bd-38a7-3acb-964b-259fbd347a53');
    }
  requestOTP(patient,doctor,callback) {
      let headers = new Headers();
      this.createHeaders(headers);
      let url=this.otpApiUrl;
      let request={
          "doctorId":111,
          "patientId":222,
          "status":"Pending",
          "to":"+94777888452",
          "from":"+17035968902",
          "statusCallbackUrl":"http://demo.twilio.com/docs/statuscallback.xml"
      };
      console.log("Sending otp...");

          this.http.post(url, JSON.stringify(request),{headers:headers}).subscribe(res=> {
              console.log(res);
              callback(null, res.json());
          });
//TODO: handle error response
    //callback(null, patient);
  }

  signup(userObj){
    let auth0User={"connection":"Username-Password-Authentication","email":userObj.email,"name":userObj.user_name,"password":userObj.password,"user_metadata":{},"email_verified":false,"app_metadata":{"roles":["patient"]}};
    return new Promise(resolve => {
      this.authService.signup(auth0User).then(res=> {
        console.log(res);
          this.load().then(data=> {
              userObj.id =res['user_id'];
              userObj.profile_pic="https://cdn4.iconfinder.com/data/icons/icoflat-2/512/avatar-64.png";
              this.data.push(userObj);
              this.storage.set('patients',JSON.stringify(this.data));
              console.log(userObj);
              resolve(userObj);
          });
        resolve(res);
      });
    });
  }
}
