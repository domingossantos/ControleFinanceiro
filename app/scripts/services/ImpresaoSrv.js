/**
 * Created by domingossantos on 04/12/16.
 */
(function(){
    'use strict';
    angular.module('controleFinanceiroApp.services').factory('ImpressaoSrv', [function() {
        return {
            imprimirDiv: function (divName) {
                var printContents = document.getElementById(divName).innerHTML;
                var popupWin = window.open('', '_blank', 'width=700,height=500');
                popupWin.document.open();
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /><link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></head><body onload="window.print()">' + printContents + '</body></html>');
                popupWin.document.close();
            }
        };
    }]);
})();