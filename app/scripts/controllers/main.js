'use strict';

/**
 * @ngdoc function
 * @name newApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newApp
 */
angular.module('newApp')
  .controller('MainCtrl', function () {
	console.log("****** Main Controller ******");
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
