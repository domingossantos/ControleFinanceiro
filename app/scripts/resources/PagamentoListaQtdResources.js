/**
 * Created by domingossantos on 27/11/16.
 */
'use strict';

angular.module('controleFinanceiroApp.resources').factory('PagamentoListaQtdResources',['$resource', function($resource){
    return $resource(app.rootContext + 'rest/pagamentos/total',{},
        {'query' : {method : 'GET', isArray : false}}
    );
}])