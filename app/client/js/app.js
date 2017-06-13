/*global angular, define, require */
/*jslint unparam: true*/

define([
    'JS',
    'angular',
    'angularAnimate',
    'angularSanitize',
    'angularUI',
    'angularUIRoute',
    'ngProgressPath',
    'amCharts',
    'amChartsSerial',
    'amChartsDirective'

], function (JS) {
    'use strict';

    var app = angular.module('JS', [
            'ui.bootstrap',
            'ui.router',
            'ngProgress',
            'amChartsDirective'
        ]),

        appConf = {
            defaultPage: '/charts',
            pages: [{
                name: 'charts',
                url: '/charts',
                type: 'page@',
                ctrlName: 'ChartsController',
                ctrlUrl: 'js/components/charts/ChartsController.js',
                viewUrl: 'js/components/charts/ChartsView.html'
            }, {
                name: 'chart',
                url: '/charts/:chartId',
                type: 'page@',
                ctrlName: 'ChartsController',
                ctrlUrl: 'js/components/charts/ChartsController.js',
                viewUrl: 'js/components/charts/ChartsView.html'
            }, {
                name: 'chartDate',
                url: '/charts/:chartId/:chartDate',
                type: 'page@',
                ctrlName: 'ChartsController',
                ctrlUrl: 'js/components/charts/ChartsController.js',
                viewUrl: 'js/components/charts/ChartsView.html'
            }]
        };

    app.config([
        '$compileProvider',
        '$controllerProvider',
        '$filterProvider',
        '$httpProvider',
        '$interpolateProvider',
        '$locationProvider',
        '$provide',
        '$stateProvider',
        '$urlRouterProvider',

        function ($compileProvider, $controllerProvider, $filterProvider, $httpProvider, $interpolateProvider,
            $locationProvider, $provide, $stateProvider, $urlRouterProvider) {

            /**
             * resoveView : registers views, controllers will be loaded automatically
             *
             */
            var resoveView = function (ctrlName, ctrlUrl, viewUrl) {

                    return {
                        templateUrl: viewUrl,
                        controller: ctrlName,
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {
                                var deferred = $q.defer();

                                require([ctrlUrl], function () {
                                    $rootScope.$apply(function () {
                                        deferred.resolve();
                                    });

                                }, function () {
                                    deferred.reject();
                                });

                                return deferred.promise;
                            }]
                        }
                    };
                },

                buildState = function (page) {
                    var state = { url: page.url, views: {} };

                    state.views[page.type] = resoveView(page.ctrlName, page.ctrlUrl, page.viewUrl);

                    return state;
                },

                page = null,
                i = 0;

            app.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            $provide.factory('AuthHttpInterceptor', ['$q', '$window', function ($q, $window) {
                return {
                    responseError: function (rejection) {
                        if (rejection.status === 500) {
                            JS.showBox('Server response code 500', 2000);
                            return false;
                        }

                        return $q.reject(rejection);
                    }
                };
            }]);

            $httpProvider.interceptors.push('AuthHttpInterceptor');

            $provide.factory('requestInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
                $rootScope.pendingRequests = 0;
                return {
                    request: function (config) {
                        $rootScope.pendingRequests++;
                        return config || $q.when(config);
                    },

                    requestError: function (rejection) {
                        $rootScope.pendingRequests--;
                        return $q.reject(rejection);
                    },

                    response: function (response) {
                        $rootScope.pendingRequests--;
                        return response || $q.when(response);
                    },

                    responseError: function (rejection) {
                        $rootScope.pendingRequests--;
                        return $q.reject(rejection);
                    }
                };
            }]);

            $locationProvider.hashPrefix(''); // remove exclamation mark in url
            $urlRouterProvider.otherwise(appConf.defaultPage);
            $httpProvider.interceptors.push('requestInterceptor');

            // $compileProvider.debugInfoEnabled(false);

            // Add app components
            for (i = 0; i < appConf.pages.length; i++) {
                page = appConf.pages[i];
                $stateProvider.state(page.name, buildState(page));
            }
        }
    ]);

    app.run([
        '$rootScope',
        'ngProgressFactory',

        function ($rootScope, ngProgressFactory) {
            var progressBar = ngProgressFactory.createInstance();

            progressBar.setColor('#3A588F');

            $rootScope.completeProgressBar = function () {
                progressBar.complete();
            };

            $rootScope.$watch('pendingRequests', function () {
                var pendingRequests = $rootScope.pendingRequests;

                if (pendingRequests > 0) {
                    progressBar.start();
                } else {
                    progressBar.complete();
                }
            });

            $rootScope.$on('$stateChangeStart', function () {
                progressBar.start();
            });

            $rootScope.$on('stopStateChangeStart', function () {
                progressBar.reset();
            });

            $rootScope.$on('$stateChangeSuccess', function () {
                progressBar.complete();
            });
        }
    ]);

    return app;
});