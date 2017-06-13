/*global define */
/*jslint unparam:true */
/*jslint continue:true */

define([
    'angular',
    'app',
    'JS',
    'amChartsDirective',
    'services/ChartsService'

], function (angular, app, JS) {
    'use strict';

    if (angular.module('JS').register) {

    angular.module('JS').register.controller('ChartsController', [
        '$scope',
        '$state',
        '$timeout',
        '$filter',
        'ChartsService',

        function ($scope, $state, $timeout, $filter, chartsService) {

            // Scope variables

            $scope.chartId = $state.params.chartId ? parseInt($state.params.chartId) : null;
            $scope.chartDate = $state.params.chartDate ? new Date($state.params.chartDate) : null;

            $scope.charts = [];
            $scope.selectedChart = {};
            $scope.currChart = {};

            $scope.chartDateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2019, 1, 1),
                minDate: new Date(2010, 1, 1),
                startingDay: 1
            };
            $scope.chartDatePicker = {
                opened: false
            };

            $scope.amChartOptions = {
                data: [],
                type: 'serial',
                theme: 'light',
                startDuration: 0,
                categoryField: 'date',
                synchronizeGrid: true,
                legend: {
                    enabled: true
                },
                chartScrollbar: {
                    enabled: true,
                },
                categoryAxis: {
                    axisColor: '#DADADA',
                    gridThickness: 1,
                    minorGridEnabled: false,
                    parseDates: true
                },
                valueAxes: [{
                    axisThickness: 0,
                    axisAlpha: 1,
                    position: 'left'
                }],
                graphs: []
            };


            // Scope methods

            $scope.init = function () {
                chartsService
                    .getCharts()
                    .then(function (data) {
                        $scope.charts = data || [];
                        var chartIndex = me.getChartIndex();

                        if ($scope.charts.length) {
                            $scope.selectedChart = $scope.charts[chartIndex];
                            $scope.chartId = $scope.selectedChart.id;
                            $scope.loadChart();
                            $scope.loadGraph();
                        }
                    });
            };

            $scope.loadChart = function () {
                chartsService
                    .getChart($scope.chartId)
                    .then(function (data) {
                        $scope.currChart = data || {};
                    });
            };

            $scope.loadGraph = function () {
                chartsService
                    .getGraphs($scope.chartId, me.getChartDateParam())
                    .then(function (data) {
                        $scope.graphs = ($scope.chartDate ? [data] : data) || [];
                        me.updateChart($scope.graphs);
                    });
            };

            $scope.onSelectChart = function () {
                $scope.chartId = $scope.selectedChart.id;
                me.updateState();
                $scope.loadChart();
                $scope.loadGraph();
            };

            $scope.onSelectChartDate = function () {
                me.updateState();
                $scope.loadGraph();
            }

            $scope.openChartDatePicker = function() {
                $scope.chartDatePicker.opened = true;
            };

            $scope.clearDate = function () {
                if ($scope.chartDate) {
                    $scope.chartDate = null;
                    me.updateState();
                    $scope.loadGraph();
                }
            }


            // Private variables

            var me = {};

            me.colors = ['#FF6600', '#01579B', '#E1EDE9', '#066896', '#E53935', '#E91E63', '#673AB7',
                '#42A5F5', '#00BCD4', '#26A69A', '#8BC34A', '#FB8C00','#757575', '#66BB6A', '#03A9F4'];


            // Private methods

            me.updateState = function () {
                if ($scope.chartDate) {
                    $state.go('chartDate', {
                        chartId: $scope.chartId,
                        chartDate: me.getChartDateParam()
                    }, { notify: false });

                } else if ($scope.chartId) {
                    $state.go('chart', {
                        chartId: $scope.chartId
                    }, { notify: false });
                }
            };

            me.getChartIndex = function () {
                var i = 0;

                if ($scope.chartId && $scope.charts.length) {
                    for (i; i < $scope.charts.length; i++) {
                        if ($scope.chartId === $scope.charts[i].id) {
                            return i;
                        }
                    }
                }

                return 0;
            };

            me.getChartDateParam = function () {
                return $scope.chartDate ? $filter('date')($scope.chartDate, 'yyyy-MM-dd') : null;
            };

            me.buildGraphs = function (graphsData) {
                var graphTypes = me.getGraphTypes(graphsData),
                    graphs = [],
                    graph = null,
                    i = 0;

                for (i; i < graphTypes.length; i++) {
                    graph = graphTypes[i];

                    graphs.push({
                        title: graph.name,
                        valueField: graph.name,
                        lineColor: graph.color,
                        lineThickness: 2,
                        type: 'smoothedLine',
                        fillAlphas: 0,
                        bullet: 'round',
                        bulletBorderThickness: 1
                    });
                }

                return graphs;
            };

            me.updateChart = function (graphsData) {
                $scope.amChartOptions.data = graphsData;
                $scope.amChartOptions.graphs = me.buildGraphs(graphsData);

                $timeout(function () {
                    $scope.$broadcast('amCharts.renderChart', $scope.amChartOptions, null);
                }, 100);
            };

            me.getGraphTypes = function (graphsData) {
                var types = [],
                    map = {},
                    key = null,
                    i = 0;

                // put all available graphs into map (normalize)
                if (angular.isArray(graphsData)) {
                    for (i; i < graphsData.length; i++) {
                        for (key in graphsData[i]) {
                            map[key] = key;
                        }
                    }
                }

                // convert map into types list
                for (key in map) {
                    if (key !== 'date') {
                        types.push({
                            name: map[key],
                            color: me.getRandomColor()
                        });
                    }
                }

                return types;
            };

            me.getRandomColor = function () {
                var min = 0,
                    max = me.colors.length,
                    rand = Math.floor(Math.random() * (max - min + 1) + min);

                return me.colors[rand];
            }
        }
    ]);

    }

});