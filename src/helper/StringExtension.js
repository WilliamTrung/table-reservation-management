/* eslint-disable no-extend-native */
String.prototype.isNullOrEmpty = function () {
    return this === null || this.trim() === '';
  };