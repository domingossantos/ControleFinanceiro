'use strict';

angular.module('controleFinanceiroApp.resources').factory('OperacaoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/operacoes/:id',{id : '@id'},
    {
      'query' : {method : 'GET', isArray : false},
      'update': { method: 'PUT'}
  });
}])
