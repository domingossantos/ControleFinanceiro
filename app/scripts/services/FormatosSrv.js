/**
 * Created by domingossantos on 23/11/16.
 */

(function(){
    'use strict';
    angular.module('controleFinanceiroApp.services').factory('FormatosSrv', [function() {
        return {
            dataBR: function (input) {
                var datePart = input.match(/\d+/g),
                    year = datePart[0],
                    month = datePart[1], day = datePart[2];

                return day+'/'+month+'/'+year;
            }
        };
    }]);
})();