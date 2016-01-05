var angular = require('angular');
var profile = angular.module('profile');

var BasicParser = require('markit/basicParser');

profile.controller('ProfileAboutMeCtrl', ($scope, me) => {

  $scope.me = me;

  $scope.markit = function(text) {
    return new BasicParser().render(text);
  };

});
