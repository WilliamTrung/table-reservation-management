import jwt_decode from 'jwt-decode';
import { User } from '../models/user';
/* eslint-disable no-extend-native */
String.prototype.IsNullOrEmpty = function () {
    return this === null || this.trim() === '';
};
String.prototype.Push = function (character) {
    return this + character;
};
String.prototype.TokenToUser = function () {
    try {
        const decodedToken = jwt_decode(this);
        console.log(decodedToken);
        return new User(decodedToken.family_name, decodedToken.given_name, decodedToken.picture);
      } catch (error) {
        throw new Error(error);
    }
};