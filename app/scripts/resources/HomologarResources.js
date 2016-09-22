'use strict';

angular.module('controleFinanceiroApp.resources').factory('HomologarResources',['$resource', function($resource){
  return $resource(app.rootContext + 'rest/movimentos/:idMovimento/homologar',{idMovimento : '@idMovimento'},
    {'query' : {method : 'GET', isArray : false},
     'update' : {method : 'PUT'}
    }
  );
}])
