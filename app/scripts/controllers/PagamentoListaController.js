'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
    .controller('PagamentoListaCtrl',['$rootScope','$scope', '$injector', '$location', 'MessageSrv', function ($rootScope, $scope, $injector, $location, MessageSrv) {

        $scope.pagamentos = [];
        $scope.itensPagamento = [];
        $scope.pagamento = {};

        $scope.maxResults = 10;
        $scope.firstResult = 0;

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

            pagamentoListaResources.query({idContaCorrente:0, status:'',dataInicio:dataInicio, dataFim:dataFim, maxResults : $scope.maxResults, firstResult: $scope.firstResult}).$promise.then(
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

            });

        }

        $scope.onHomologar = function(movimento){
            if(movimento.valor == movimento.valorEsperado){
                var homologarResources = $injector.get('HomologarResources');
                movimento.status = 'HOMOLOGADO';
                homologarResources.update({idMovimento: movimento.id},{}).$promise.then(
                    function (success) {
                        $('#modalHomologa').modal('hide');
                        $scope.onPesquisar();
                        MessageSrv.info('Pagamento Homologado!');
                    }
                );
            } else {
                MessageSrv.warning('Valor do pagamento é inferior ao Valor Esperado!');
            }
        }

        $scope.onPaginar = function (pagina) {

            if(pagina == '+1'){
                $scope.firstResult += $scope.maxResults;
            }

            if(pagina == '-1'){
                if($scope.firstResult > 0){
                    $scope.firstResult -= $scope.maxResults;
                }
            }

            $scope.onPesquisar();
        }



        $scope.printDiv = function(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var popupWin = window.open('', '_blank', 'width=300,height=300');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /><link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }



    }]);
