/**
 * Created by Madura on 06/10/2016.
 */
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
@Injectable()
export class DoctorService {
    data: any;

    constructor(public http: Http) {}

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
}