import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Channel page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html'
})
export class Channel {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Channel Page');
  }

}
