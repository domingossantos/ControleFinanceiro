'use strict';

angular.module('controleFinanceiroApp.resources').factory('PlanoContaResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/planocontas/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
