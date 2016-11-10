/**
 * Created by Madura on 27/10/2016.
 */
import {Storage} from '@ionic/storage';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http,Headers} from '@angular/http';
// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;
import {Events} from 'ionic-angular';
@Injectable()
export class AuthService {
auth0Token:string;
 auth0Url:string;
  jwtHelper: JwtHelper = new JwtHelper();
  auth0 = new Auth0({clientID: 'ABQ2GGN6rCeOGAFmg5ypJLrEINeV9g4K', domain: 'madura.auth0.com'});
  lock = new Auth0Lock('ABQ2GGN6rCeOGAFmg5ypJLrEINeV9g4K', 'madura.auth0.com', {
    auth: {
      redirect: false,
      params: {
        scope: 'openid offline_access',
      }
    }
  });
  storage: Storage = new Storage();
  refreshSubscription: any;
  user: Object;
  zoneImpl: NgZone;
  idToken: string;
events:any;
  constructor(private authHttp: AuthHttp, zone: NgZone, events: Events,public http: Http) {
    this.zoneImpl = zone;
    this.events=events;
    this.auth0Token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIyQmpMaFVFN0Mwb3lVYzB1TWpQTDh1UWM5blVhSVVPVyIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSIsInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiXX19LCJpYXQiOjE0Nzg4MTA0MjIsImp0aSI6Ijc4OTlhODRkOGY1MDdiYTE2ZTZiMWEzYjVkYTc3NDQ4In0.JLVBdR15Jj33kGu7IIKZ1a2k5iuA-TqymubTgMfWSVc";
    this. auth0Url="https://madura.auth0.com/api/v2/users";
    // Check if there is a profile saved in local storage
    this.storage.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    this.storage.get('id_token').then(token => {
      console.log("Token:");
      console.log(token);
      this.idToken = token;
      if (this.authenticated()) {
        events.publish("user:authenticated", this.user);
      }
    });

    this.lock.on('authenticated', authResult => {
      this.storage.set('id_token', authResult.idToken);
      this.idToken = authResult.idToken;

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }
        console.log(profile);
        profile.user_metadata = profile.user_metadata || {};
        this.storage.set('profile', JSON.stringify(profile));
        this.user = profile;
        this.events.publish("user:authenticated", this.user);
      });

      this.lock.hide();

      this.storage.set('refresh_token', authResult.refreshToken);
      this.zoneImpl.run(() => this.user = authResult.profile);
      // Schedule a token refresh
      this.scheduleRefresh();

    });
  }

  public authenticated() {
    return tokenNotExpired('id_token', this.idToken);
  }

  public login() {
    // Show the Auth0 Lock widget
    this.lock.show();
  }

  public getProfile() {
    //if(this.authenticated()) {
    console.log(this.user);
    return this.user;
    // }
    //console.log(this.storage.get('profile'));
  }

  public logout() {
    this.storage.remove('profile');
    this.storage.remove('id_token');
    this.idToken = null;
    this.storage.remove('refresh_token');
    this.zoneImpl.run(() => this.user = null);
    // Unschedule the token refresh
    this.unscheduleRefresh();
    this.events.publish("user:logout");
  }

  public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token

    let source = Observable.of(this.idToken).flatMap(
      token => {
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);

        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

        return Observable.interval(delay);
      });

    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });
  }

  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (this.authenticated()) {
      let source = Observable.of(this.idToken).flatMap(
        token => {
          // Get the expiry time to generate
          // a delay in milliseconds
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;

          // Use the delay in a timer to
          // run the refresh at the proper time
          return Observable.timer(delay);
        });

      // Once the delay time from above is
      // reached, get a new JWT and schedule
      // additional refreshes
      source.subscribe(() => {
        this.getNewJwt();
        this.scheduleRefresh();
      });
    }
  }

  public unscheduleRefresh() {
    // Unsubscribe fromt the refresh
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  public getNewJwt() {
    // Get a new JWT from Auth0 using the refresh token saved
    // in local storage
    this.storage.get('refresh_token').then(token => {
      this.auth0.refreshToken(token, (err, delegationRequest) => {
        if (err) {
          alert(err);
        }
        this.storage.set('id_token', delegationRequest.id_token);
        this.idToken = delegationRequest.id_token;
      });
    }).catch(error => {
      console.log(error);
    });

  }
  createAuthorizationHeader(headers:Headers) {
    headers.append('Authorization',this.auth0Token);
    headers.append('Content-Type','application/json');
  }
  public signup(userObj){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    let url=this.auth0Url;
    return new Promise(resolve => {
      this.http.post(url,JSON.stringify(userObj),{headers:headers}).subscribe(res => {
        resolve(res.json());
      })
    });
  }
}
