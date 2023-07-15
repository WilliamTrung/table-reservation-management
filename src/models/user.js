import { USER_EMAIL, USER_FAMILYNAME, USER_GIVENNAME, USER_PICTURE } from "../constants/constants";

export class User {
    constructor(email, family_name, given_name, picture) {
        this.email = email
      this.family_name = family_name;    
      this.given_name = given_name;
      this.picture = picture;
    }
    static GetSession(){        
        let email = sessionStorage.getItem(USER_EMAIL);
        let family_name = sessionStorage.getItem(USER_FAMILYNAME);
        let given_name = sessionStorage.getItem(USER_GIVENNAME);
        let picture = sessionStorage.getItem(USER_PICTURE);
        return new User(email, family_name, given_name, picture);
    }
    getFullname(){
        return this.family_name + ' ' + this.given_name;
    }   
}

  