/**
 * Created by domingossantos on 01/10/16.
 */
'use strict';

angular.module('controleFinanceiroApp.services').factory('MessageSrv', ['growl', function(growl) {
  return {
    info: function (mensagem) {
      growl.info(mensagem, { ttl : 9000});
    },

    warning: function (mensagem) {
      //alert(mensagem);
      growl.warning(mensagem, { ttl : 9000});
    },

    error: function (mensagem) {
      //alert(mensagem);
      growl.error(mensagem, { ttl : 9000});
    },

    success: function (mensagem) {
      growl.success(mensagem, { ttl : 9000});
    }
  };
}]);





