import * as firebase from 'firebase';

class Firebase {
  /**
   * Initialises Firebase
   */

  static initialise() {
    const config = {
      apiKey: "AIzaSyCJCfclNJfbPd9WOYwQVikUuRXy-reyPJk",
      authDomain: "dailydrive-aa072.firebaseapp.com",
      databaseURL: "https://dailydrive-aa072.firebaseio.com",
      storageBucket: "dailydrive-aa072.appspot.com",
      messagingSenderId: "812225606843"
    };

    firebase.initializeApp(config);
  }
}

export default Firebase;
