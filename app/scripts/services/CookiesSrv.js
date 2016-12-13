/**
 * Created by domingossantos on 27/11/16.
 */
(function(){
    'use strict';
    angular.module('controleFinanceiroApp.services').factory('CookiesSrv', [function() {
        return {
            setAtributo : function(chave, valor){
                document.cookie = chave+'='+valor+';';
            },
            getAtributo : function(name){
                var ca = document.cookie.split(';');
                for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length+1,c.length);
                    }
                }
                return "";
            }
        }
    }]);

})();