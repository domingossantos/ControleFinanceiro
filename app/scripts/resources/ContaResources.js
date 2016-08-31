'use strict';

angular.module('controleFinanceiroApp.resources').factory('ContaResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/contas/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
