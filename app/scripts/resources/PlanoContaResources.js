'use strict';

angular.module('controleFinanceiroApp.resources').factory('PlanoContaResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/planocontas/:idPlanoConta',{idPlanoConta : '@idPlanoConta'},
    {
      'query' : {method : 'GET', isArray : false},
      'get' : {method : 'GET', isArray : false}
  });
}])
