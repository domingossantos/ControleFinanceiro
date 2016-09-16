'use strict';

angular.module('controleFinanceiroApp.resources').factory('LoginResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/login/:id',{id : '@id'},
    {'query' : {method : 'GET', isArray : false}
  });
}])
