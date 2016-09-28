'use strict';

angular.module('controleFinanceiroApp.resources').factory('BalancoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/balancos/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
