'use strict';

angular.module('controleFinanceiroApp.resources').factory('MovimentoResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/movimentos/:idMovimento',{idMovimento : '@idMovimento'},
    {'query' : {method : 'GET', isArray : false},
     'update' : {method : 'PUT'}
    }
  );
}])
