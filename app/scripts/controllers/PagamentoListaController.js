'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('PagamentoListaCtrl',['$rootScope','$scope', '$injector', '$location', 'growl', function ($rootScope, $scope, $injector, $location, growl) {

    $scope.pagamentos = [];
    $scope.itensPagamento = [];
    $scope.pagamento = {};

    $scope.meses = [
      {id:1,nome:'JANEIRO'},
      {id:2,nome:'FEVEVEIRO'},
      {id:3,nome:'MARÇO'},
      {id:4,nome:'ABRIL'},
      {id:5,nome:'MAIO'},
      {id:6,nome:'JUNHO'},
      {id:7,nome:'JULHO'},
      {id:8,nome:'AGOSTO'},
      {id:9,nome:'SETEMBRO'},
      {id:10,nome:'OUTUBRO'},
      {id:11,nome:'NOVEMBRO'},
      {id:12,nome:'DEZEMBRO'}
    ];
    $scope.getUltimoDiaMes = function(month,year)
    {
      var day;
      switch(month) {
        case 1 :
        case 3 :
        case 5 :
        case 7 :
        case 8 :
        case 10:
        case 12:
          day = 31;
          break;
        case 4 :
        case 6 :
        case 9 :
        case 11:
          day = 30;
          break;
        case 2 :
          if( ( (year % 4 == 0) && ( year % 100 != 0) ) || (year % 400 == 0) )
            day = 29;
          else
            day = 28;
          break;
      }

      return day;
    }


    var now = new Date;
    var mes = parseInt(now.getMonth());
    $scope.mes = $scope.meses[mes];

    var pagamentoListaResources = $injector.get('PagamentoResources');

    $scope.onPesquisar = function(){
      var mes = $scope.mes.id;
      var ano = new Date().getFullYear();
      var dataInicio = '01/'+mes+'/'+ano;
      var dataFim = $scope.getUltimoDiaMes(mes,ano)+'/'+mes+'/'+ano;

      pagamentoListaResources.query({idContaCorrente:0, status:'',dataInicio:dataInicio, dataFim:dataFim, maxResults : 10, firstResult: 0}).$promise.then(
        function (success) {
          $scope.pagamentos = success;
        }
      );
    }

    $scope.onPesquisar();

    $scope.onDetalhePagamento = function (pagamento) {
      $scope.pagamento = pagamento;


      var itemPagamentoResources = $injector.get('ItemPagamentoResources');

      itemPagamentoResources.query({idPagamento:$scope.pagamento.id},function (success) {
        $scope.itensPagamento = success.itens;
        console.log(success);
      });

    }

  }]);
