'use strict';

angular.module('controleFinanceiroApp.resources').factory('ObraResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/obras/:idObra',{idObra : '@idObra'},
    {'query' : {method : 'GET', isArray : false},
     'update' : {method:'PUT', isArray: false}
  });
}])
