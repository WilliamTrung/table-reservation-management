export class User {
    family_name = null;
    given_name = null;

    constructor(family_name, given_name, picture) {
      this.family_name = family_name;    
      this.given_name = given_name;
      this.picture = picture;
    }
    static GetSession(){        
        let family_name = sessionStorage.getItem('user-family_name');
        let given_name = sessionStorage.getItem('user-given_name');
        let picture = sessionStorage.getItem('user-picture');
        return new User(family_name, given_name, picture);
    }
    getFullname(){
        return this.family_name + ' ' + this.given_name;
    }   
}

  