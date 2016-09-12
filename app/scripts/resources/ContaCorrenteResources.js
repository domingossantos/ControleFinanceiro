/**
 * Created by domingossantos on 11/09/16.
 */
'use strict';

angular.module('controleFinanceiroApp.resources').factory('ContaCorrenteResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/contascorrentes/:id',{id : '@id', idCliente: '@IdCliente'},
    {
      'get' : {method : 'GET', isArray : false},
      'query' : {method : 'GET', isArray: false}
    });
}])
