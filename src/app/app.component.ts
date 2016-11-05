import {Component, ViewChild} from '@angular/core';

import {Events, MenuController, Nav, Platform} from 'ionic-angular';
// import { Splashscreen, StatusBar } from 'ionic-native';

import {AccountPage} from '../pages/account/account';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
import {PatientPage} from '../pages/patient/patient';
import {ConferenceData} from '../providers/conference-data';
import {UserData} from '../providers/user-data';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {AuthService} from '../providers/auth-service';
import {DoctorApprovePage} from '../pages/doctor-approve/doctor-approve';
export interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageObj[] = [
    /* {title: 'Channel', component: TabsPage, icon: 'calendar'},
     {title: 'Report', component: TabsPage, index: 1, icon: 'document'},
     {title: 'Patients', component: PatientPage, icon: 'people'}*//*,
     { title: 'Map', component: TabsPage, index: 2, icon: 'map' },
     { title: 'About', component: TabsPage, index: 3, icon: 'information-circle' },*/
  ];
  loggedInPages: PageObj[] = [
    {title: 'Account', component: AccountPage, icon: 'person'},
    {title: 'Logout', component: TabsPage, icon: 'log-out'}
  ];
  loggedOutPages: PageObj[] = [
    {title: 'Login', component: LoginPage, icon: 'log-in'},
    {title: 'Signup', component: SignupPage, icon: 'person-add'}
  ];
  rootPage: any = TutorialPage;

  constructor(public events: Events,
              public userData: UserData,
              public menu: MenuController,
              platform: Platform,
              confData: ConferenceData,
              authService: AuthService) {
    // Call any initial plugins when ready
    platform.ready().then(() => {
      // StatusBar.styleDefault();
      // Splashscreen.hide();
    });

    // load the conference data
    confData.load();

    if (!authService.authenticated()) {
      this.rootPage = LoginPage;
    }
    // decide which menu items should be hidden by current login status stored in local storage
    /*this.userData.hasLoggedIn().then((hasLoggedIn) => {
     this.enableMenu(hasLoggedIn === 'true');
     });*/
    this.enableMenu(true);
    this.listenToLoginEvents();
  }

  openPage(page: PageObj) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, {tabIndex: page.index});

    } else {
      this.nav.setRoot(page.component);
    }

    if (page.title === 'Logout') {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.nav.setRoot(LoginPage);
      this.appPages=[];
      this.enableMenu(false);
    });
    this.events.subscribe("user:authenticated", (user)=> {
      console.log("USER");
      console.log(user);

      if (user) {
        this.enableViews(user[0].roles);
        this.enableMenu(true);
      }
    });
  }

  enableViews(roles) {
    if (roles.includes("patient")) {
      this.nav.setRoot(TabsPage);
      this.appPages=[{title: 'Channel', component: TabsPage, icon: 'calendar'},{title: 'Report', component: TabsPage, index: 1, icon: 'document'}];
      //this.appPages.push({title: 'Report', component: TabsPage, index: 1, icon: 'document'});
    }
    if (roles.includes("doctor")) {
      this.nav.setRoot(PatientPage);
      this.appPages=[{title: 'Patients', component: PatientPage, icon: 'people'}];
    }
    if (roles.includes("admin")) {
      this.nav.setRoot(DoctorApprovePage);
      this.appPages=[{title: 'Approve', component: DoctorApprovePage, icon: 'add-circle'}];
    }
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
}
