'use strict';

angular.module('controleFinanceiroApp.resources').factory('ContaCorrenteResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/contascorrentes/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
