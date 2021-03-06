import {Injectable} from '@angular/core';

declare var firebase: any;

@Injectable()
export class Fire {
  user: any = {};

  constructor() {
    var config = {
      apiKey: "AIzaSyA5D81T5yx3EAzCeqA4l8n9HxV903Zx7Cs",
      authDomain: "ansomessage-54822.firebaseapp.com",
      databaseURL: "https://ansomessage-54822.firebaseio.com",
      storageBucket: "",
    };

    firebase.initializeApp(config);
  }

  login(token: string, pushId: string, successCallback, errorCallback) {
    let credential = firebase.auth.FacebookAuthProvider.credential(token);

    firebase.auth().signInWithCredential(credential).then(response => {
      this.setUser(token, pushId, response.providerData[0]);
      successCallback();
    }, error => {
      errorCallback(error);
    })
  }

  getDB() {
    return firebase;
  }

  getUser(id, successCallback) {
    let ref = firebase.database().ref('users').child(id);

    ref.once('value', (snapshot) => {
      let user = snapshot.val();
      successCallback(user);
    })
  }

  private setUser(token: string, pushId: string, authData: any) {
    this.user.name = authData.displayName;
    this.user.photo = authData.photoURL;
    this.user.id = authData.uid;
    this.user.token = token;
    this.user.pushId = pushId;

    this.saveUser();
  }

  private saveUser() {
    firebase.database().ref('users').child(this.user.id).set({
      name: this.user.name,
      photo: this.user.photo,
      pushId: this.user.pushId
    });
  }
}
