/*global define*/

define([
    'angular',
    'app',
    'JS'

], function (angular, app, JS) {
    'use strict';

    if (angular.module('JS').register) {

    angular.module('JS').register.service('ChartsService', [
        '$rootScope',
        '$http',
        '$q',

        function ($rootScope, $http, $q) {

            return {

                getCharts: function () {
                    var deferred = $q.defer(),
                        errorMsg = 'Cannot get charts.';

                    $http({
                        method: 'GET',
                        url: '/charts',

                    }).then(function (result) {
                        JS.resolvePromise(deferred, result, errorMsg);

                    }).catch(function (response) {
                        JS.catchPromiseError(deferred, errorMsg, response);
                    });

                    return deferred.promise;
                },

                getChart: function (id) {
                    var deferred = $q.defer(),
                        errorMsg = 'Cannot get chart.';

                    $http({
                        method: 'GET',
                        url: '/charts/' + id

                    }).then(function (result) {
                        JS.resolvePromise(deferred, result, errorMsg);

                    }).catch(function (response) {
                        JS.catchPromiseError(deferred, errorMsg, response);
                    });

                    return deferred.promise;
                },


                getGraphs: function (id, date) {
                    var deferred = $q.defer(),
                        url = '/charts/' + id + '/graphs' + (date ? '/' + date : ''),
                        errorMsg = 'Cannot get graphs.';

                    $http({
                        method: 'GET',
                        url: url

                    }).then(function (result) {
                        JS.resolvePromise(deferred, result, errorMsg);

                    }).catch(function (response) {
                        JS.catchPromiseError(deferred, errorMsg, response);
                    });

                    return deferred.promise;
                }
            };
        }

    ]);

    }
});
