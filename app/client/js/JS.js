/*global JS:true*/
/*jslint browser: true*/
/*jslint unparam: true*/

'use strict';

var JS = window.JS || {};

JS = {

    init: function () {
        JS.initErrorEvent();
    },

    resolvePromise: function (deferred, result, errorMsg) {
        if (result.data && result.data.error) {
            JS.showError(errorMsg, result.data.error);
            deferred.reject(errorMsg + ' ' + result.data.error);
        } else {
            deferred.resolve(result.data);
        }
    },

    catchPromiseError: function (deferred, errorMsg, response) {
        var error = response.data && response.data.error ? response.data.error : '';

        JS.showError(errorMsg, error);
        deferred.reject(errorMsg + ' ' + error);
    },

    getLastModified: function (record) {
        return record.lastModified || null;
    },

    showBox: function (message, delayTime) {
        var me = JS,
            boxId = 'show-box',
            boxEl = document.getElementById(boxId);

        if (boxEl === null) {
            boxEl = document.createElement('div');
            boxEl.setAttribute('id', boxId);
            document.body.appendChild(boxEl);
        }

        me.showBox = function (message, delayTime) {
            delayTime = delayTime || 2000;
            if (message === false) {
                boxEl.style.display = 'none';
                return true;
            }
            boxEl.style.display = 'block';

            // wrap long error messages
            message = message.replace(/\\n/g, '<br/>');
            if (message.length > 100) {
                message = message.substring(0, 100) + '...';
            }

            boxEl.innerHTML = '<div><span>' + message + '</span></div>';

            setTimeout(function () {
                me.showBox(false);
            }, delayTime);
        };
        return me.showBox(message, delayTime);
    },

    initErrorEvent: function () {
        window.onerror = function (msg, url, line) {
            JS.showError('Error! Critical Error: ' + msg + '; url=' + url + '; line=' + line);
        };
    },

    showError: function (message, error) {
        var me = JS,
            location = window.location,
            urlHash = location.hash,
            documentUrl = document.URL || location.href,
            msg = message + (error ? '<br/>Details: ' + error : '');

        documentUrl += documentUrl.indexOf(urlHash) === -1 ? urlHash : ''; // add hash for IE
        me.logError(msg.indexOf('Critical Error') === 0 ? 'Critical' : 'Major', msg + '; documentUrl =' + documentUrl);
        me.showBox(msg, 7000);
    },

    /**
     * logError: send js error to server. passing data as image link to avoid ajax call
     *
     * @param  {String} severity
     * @param  {String} message
     *
     * @return {Boolean}
     */
    logError: function (severity, message) {
        // message = message.substr(0, 1900); // IE max 2048 chracters in get request

        // this line send error message to the server for saving in log/js.log file and further investigation
        // new Image().src = '/jsErrorLog.do?msg=' + encodeURIComponent('Severity: ' + severity + '; ' + message);

        return true;
    },

    apply: function (obj, props) {
        var prop = null;

        for (prop in props) {
            if (props.hasOwnProperty(prop)) {
                obj[prop] = props[prop];
            }
        }
        return obj;
    },

    cloneJsonObject: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    getArrayItemIndex: function (arrayItems, propertyName, searchValue) {
        var i = arrayItems.length;

        while (i--) {
            if (arrayItems[i][propertyName] === searchValue) {
                return i;
            }
        }
        return -1; // not found
    },

    scrollTo: function (sel, ms) {
        var el = angular.element(document.querySelector(sel))[0];

        if (el) {
            if (ms) {
                setTimeout(function () {
                    el.scrollIntoView();
                }, ms);
            } else {
                el.scrollIntoView();
            }
        }
    },

    scrollTop: function (ms) {
        JS.scrollTo('body', ms);
    }
};

JS.init();



/**
 * Utils
 *
 */
JS.utils = {

    /**
     * formatNumber : e.g. 12,345,678.90
     *
     * @param  {number} x
     * @return {string}
     */
    formatNumber: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * roundNumber
     *
     * @param  {number} x        value
     * @param  {number} decimals floating precision
     * @return {number}          result value
     */
    roundNumber: function (x, decimals) {
        return Math.round(x * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },


    /**
     * parseFloatSafe : cleanup and parse string to number
     *
     * @param  {string}         str   original string
     * @param  {boolean}        safe  is safe parse
     *
     * @return {number/string}        parsed number or original string if NaN
     */
    parseFloat: function (str, safe) {
        var num;

        if ($.isNumeric(str)) {
            return str;
        }
        num = safe ? Number.parseFloat(str.replace('.', '').replace(',', '.')) : Number.parseFloat(str);
        if (isNaN(num)) {
            return str;
        }
        return num;
    },

    /**
     * parseDate : parse string to date
     *
     * @param  {string} str         string with formatted date
     * @param  {string} format      date format (default: dd.mm.yyyy)
     *
     * @return {date/string}        parsed date or original string if cannot parse
     */
    parseDate: function (str, format) {
        var p = str.split('.');

        return new Date(p[2], p[1] - 1, p[0]);
    },

    /**
     * getObjectValueByRef : get object value by stringified key chain reference
     *
     * @param  {object} obj     source object (e.g. { parent : { item : { key : 'value' }}} )
     * @param  {string} str     stringified key chain (e.g. 'parent.item.key')
     *
     * @return {any}    value   object value
     */
    getObjectValueByRef: function (obj, str) {
        var i = 0;
        str = str.split('.');
        for (i = 0; i < str.length; i++) {
            obj = obj[str[i]];
        }
        return obj;
    },

    /**
     * setConstructorParams : generic object constructor based on config params
     *
     * @param {object} conf     new object configuration
     * @param {object} scope    new object scope
     */
    setConstructorParams: function (conf, scope) {
        var param = null;

        for (param in conf) {
            if (conf.hasOwnProperty(param)) {
                scope[param] = conf[param];
            }
        }
    },

    /**
     * callback : run callback function in predefined scope
     *
     * @param  {object}   params { fn : function , scope : scope }
     */
    callback: function (params) {
        if (params && params.fn) {
            if (params.scope) {
                params.fn.call(params.scope);
            } else {
                params.fn();
            }
        }
    },

    /**
     * isIE
     *
     * @return {Boolean}
     */
    isIE: function () {
        return navigator.appVersion.indexOf("MSIE") !== -1;
    },

    /**
     * isIE9
     *
     * @return {Boolean}
     */
    isIE9: function () {
        return JS.utils.getBrowserVersion() <= 9;
    },

    /**
     * getBrowserVersion
     *
     * @return {Number}
     */
    getBrowserVersion: function () {
        var version = 999;
        if (JS.utils.isIE()) {
            version = parseFloat(navigator.appVersion.split("MSIE")[1]);
        }
        return version;
    },

    /**
     * isTouchDevice : simple touch device detection by browser name
     *
     * @return {Boolean}
     */
    isTouchDevice: function () {
        var ua = navigator.userAgent.toLowerCase();

        return (ua.match(/(iphone|ipod|ipad)/) || ua.match(/(android)/) || ua.match(/(iemobile)/) ||
            ua.match(/iphone/i) || ua.match(/ipad/i) || ua.match(/ipod/i) || ua.match(/blackberry/i) || ua.match(/bada/i));
    }
};



/**
 * JS.store : generic data store
 *
 * @class   JS.store
 *
 */

JS.store = function (conf) {
    JS.utils.setConstructorParams(conf, this);
};

JS.store.prototype = {
    name: '',
    items: [],
    type: 'list', // list, map (array, object)
    sortConf: {
        field: null,
        order: 'asc' // enum ('asc', 'desc')
    },

    load: function (data, append) {
        var i = 0;

        if (!append) {
            this.items = [];
        }

        if ($.isArray(data)) {
            this.type = 'list';
            for (i = 0; i < data.length; i++) {
                this.items.push(data[i]);
            }
        } else {
            this.type = 'map';
            this.items.push(data);
        }
        return this;
    },

    /**
     * find : find record's index in list store or value in map store
     *
     * @param  {number/string}  attr        attribute to search
     * @param  {any}            value       value to search
     *
     * @return {number/string}              record's index or value
     */
    find: function (attr, value) {
        var i = 0;
        if (this.items.length) {
            if (this.type === 'map') {
                return this.items[0][attr];
            }
            for (i = 0; i < this.items.length; i++) {
                if ($.isPlainObject(this.items[i]) && this.items[i][attr] === value) {
                    return i;
                }
                if (typeof this.items[i] === 'string' && this.items[i] === value) {
                    return i;
                }
            }
        }
        return false;
    },

    /**
     * findRecord : find record(s) by attributes/values
     *
     * @param  {object} props       filter properties ({ 'attr1' : 'value1', 'attr2' : 'value2' })
     * @return {array}              matched records
     */
    findRecord: function (props) {
        if (this.items.length) {
            var recs = this.items.filter(function (entry) {
                return Object.keys(props).every(function (key) {
                    return entry[key] === props[key];
                });
            });
            if (recs.length === 1) {
                return recs[0];
            }
            return recs;
        }
        return false;
    },

    /**
     * add : add new properties to map store
     *
     * @param {object} params       new parameters for adding to map store
     * @return {object} record      map record
     */
    add: function (params) {
        if (this.type === 'map') {
            if (!this.items.length) {
                this.items = [params];
            } else {
                $.extend(this.items[0], params);
            }
        }
        return this.items[0];
    },

    /**
     * addRecord : append new record to store
     *
     * @param {object} data         record data
     * @return {object} data        record
     */
    addRecord: function (data) {
        var rec = this.type === 'list' ? [data] : data;
        this.load(rec, true);
        return data;
    },

    /**
     * updateRecord : find record by attribute/value and replace its data
     *
     * @param  {object}         rec         record data for update
     * @param  {number/string}  attr        attribute for find record
     * @param  {any}            value       value for find record
     *
     * @return {object/boolean}             record or false
     */
    updateRecord: function (rec, attr, value) {
        var idx = this.find(attr, value);
        if (idx !== false) {
            this.items[idx] = rec;
            return this.items[idx];
        }
        return false;
    },

    /**
     * deleteRecord : find record by attribute/value and delete it
     *
     * @param  {number/string}  attr        attribute for find record
     * @param  {any}            value       value for find record
     */
    deleteRecord: function (attr, value) {
        var idx = this.find(attr, value);
        if (idx) {
            this.items.splice(idx, 1);
        }
    },

    /**
     * getSortConf
     *
     * @return {object}     sortConf    this store sort configuration
     */
    getSortConf: function () {
        if (this.sortConf.field) {
            return this.sortConf;
        }
        return null;
    },

    /**
     * sortBy : function to sort  array of objects by the given field
     *
     * @private
     * @param  {string}     field
     * @param  {string}     type        field type enum: 'string', 'number', 'date'
     * @param  {boolean}    reverse
     *
     * @return {function}
     */
    sortBy: function (field, type, reverse) {
        var up = reverse ? 1 : -1,
            down = reverse ? -1 : 1;

        return function (a, b) {
            var aval = JS.utils.getObjectValueByRef(a, field),
                bval = JS.utils.getObjectValueByRef(b, field);

            // convert string values to relevant data types
            if (type === 'number') { // number
                aval = JS.utils.parseFloat(aval, true);
                bval = JS.utils.parseFloat(bval, true);

            } else if (type === 'date') { // date
                aval = JS.utils.parseDate(aval, 'dd.mm.yyyy');
                bval = JS.utils.parseDate(bval, 'dd.mm.yyyy');
            }

            // compare values
            if (aval < bval) {
                return up;
            }
            if (aval > bval) {
                return down;
            }
            return 0;
        };
    },

    /**
     * sort : sort list store by field
     *
     * @param  {string}     field   record field
     * @param  {string}     type    field type enum: 'string', 'number', 'date'
     * @order  {string}     order   order enum: 'asc', 'desc'
     *
     * @return {object}     this store
     */
    sort: function (field, type, order) {
        var currType = type || 'string',
            reverse = (order !== 'undefined' && order === 'desc') ? true : false,
            sortBy = this.sortBy(field, currType, reverse);

        this.items.sort(sortBy);
        this.sortConf.field = field;
        this.sortConf.order = order;

        return this;
    }
};
