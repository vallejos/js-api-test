/*global define*/
/*jslint unparam: true*/

define([
    'app'

], function (app) {
    'use strict';

    var RootController = function ($scope, $rootScope, $location) {

        $scope.app = {
            id: 'app',
            name: 'Charts App',
            title: 'Charts App',
            pages: [{
                id: 'charts',
                name: 'Charts',
                title: 'Charts',
                cls: 'active'
            }]
        };

        $scope.openPage = function (page) {
            $location.path('/' + page);
        };

    };

    RootController.$inject = ['$scope', '$rootScope', '$location'];
    app.controller('RootController', RootController);

});