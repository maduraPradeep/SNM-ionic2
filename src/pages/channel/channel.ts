import {Component} from '@angular/core';

import {
  App,
  NavController,
  ActionSheet,
  ActionSheetController
} from 'ionic-angular';

import {DoctorService} from '../../providers/doctors-data';

@Component({
  selector: 'page-schedule',
  templateUrl: 'channel.html'
})
export class SchedulePage {
  queryText = '';
  doctors = [];
  actionSheet: ActionSheet;

  constructor(
              public app: App,
              public navCtrl: NavController,
              public doctorService: DoctorService,
              public actionSheetCtrl: ActionSheetController) {

  }

  ionViewDidEnter() {
    this.app.setTitle('Channel');
  }

  ngAfterViewInit() {
    this.getDoctors();
  }

  getDoctors() {
    this.doctorService.search(this.queryText).then(data=> {
      console.log(data);
      return this.doctors = data;
    });
  };

  requestAppointment(doctor) {
    //let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact with ' + doctor.name,
      buttons: [
        {
          text: `Request Appointment`,

          handler: () => {
            window.open('mailto:' + doctor.email);
          }
        }
      ]
    });

    actionSheet.present();
  }
}
