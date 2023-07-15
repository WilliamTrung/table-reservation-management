import "./StringExtension";
/* eslint-disable no-extend-native */
Function.prototype.TokenIsNullOrEmpty = function () {
    var token = sessionStorage.getItem('token');
  if(token == null || token.trim() === ''){
    console.log("token is null or empty");
    return true;
  } else {
    console.log("token is not null or empty");
    return false;
  }
};

