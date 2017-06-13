/*global require*/
/*jslint browser: true*/

require.config({
    baseUrl: '/js',
    waitSeconds: 0, // removes timeout for loading assets

    paths: {
        angular: '../lib/angular/angular',
        angularAnimate: '../lib/angular-animate/angular-animate',
        angularSanitize: '../lib/angular-sanitize/angular-sanitize.min',
        angularUI: '../lib/angular-ui-bootstrap/ui-bootstrap-tpls',
        angularUIRoute: '../lib/angular-ui-router/angular-ui-router.min',
        ngProgressPath: '../lib/ngprogress/ngprogress.min',
        amCharts: '../lib/amcharts/amcharts',
        amChartsSerial: '../lib/amcharts/serial',
        amChartsDirective: '../lib/amcharts-angular/amChartsDirective'
    },

    shim: {
        JS: {
            exports: 'JS'
        },

        angular: {
            exports: 'angular'
        },

        amCharts: {
            exports: 'amCharts'
        },

        angularAnimate: ['angular'],
        angularUI: ['angular'],
        angularUIRoute: ['angular'],
        angularSanitize: ['angular'],
        ngProgressPath: ['angular'],

        amChartsSerial: ['amCharts'],
        amChartsDirective: ['angular']
    }
});

require([
    'angular',
    'JS',
    'RootController'

], function (angular) {
    'use strict';

    angular.bootstrap(document, ['JS']);

    try {
       document.body.setAttribute("ng-app", "JS");
    } catch(e){
        console.log(e);
    };
});