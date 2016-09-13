/**
 * Created by domingossantos on 11/09/16.
 */
'use strict';

angular.module('controleFinanceiroApp.resources').factory('SubContaResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/contascorrentes/:idContaCorrente/subcontas/:idSubConta',
    {idContaCorrente : '@idContaCorrente', idSubConta: '@idSubConta'},
    {
      'get' : {method : 'GET', isArray : false},
      'query' : {method : 'GET', isArray: false},
      'update' : {method : 'PUT'}
    });
}])

