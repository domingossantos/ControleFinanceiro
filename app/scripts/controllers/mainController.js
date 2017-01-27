'use strict';

/**
 * @ngdoc function
 * @name controleFinanceiroApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the controleFinanceiroApp
 */
angular.module('controleFinanceiroApp.controllers')
    .controller('MainCtrl', ['$rootScope','$scope', '$injector',function ($rootScope, $scope, $injector) {
        $scope.menu = false;
        $scope.dataFim = null;
        $scope.dataInicio = null;

        $scope.dataInicioP = null;
        $scope.dataFimP = null;

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

        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2000,1,1),
            startingDay: 1,

        };

        $scope.popupDataInicio = {
            opened: false
        };

        $scope.openPopupDataInicio = function() {
            $scope.popupDataInicio.opened = true;
        };

        $scope.popupDataFim = {
            opened: false
        };

        $scope.openPopupDataFim = function() {
            $scope.popupDataFim.opened = true;
        };

        var dataAtual = new Date();
        var mes = dataAtual.getMonth() + 1;

        $scope.dataInicio =  new Date(dataAtual.getFullYear(),dataAtual.getMonth(), 1);
        $scope.dataFim =  new Date(dataAtual.getFullYear(),dataAtual.getMonth(),$scope.getUltimoDiaMes(mes,dataAtual.getFullYear()));

        $scope.login = function(){
            $scope.menu = true;
        };


        $scope.movimentos =[];
        $scope.status = 'PENDENTE_HOMOLOGACAO';

        $scope.posicaoContas = 0;

        $scope.maxResults = 10;
        $scope.firstResult = 0;
        $scope.registrosPorPagina = 10;

        $scope.detalheMovimento = {};
        $scope.itens = {};

        $scope.movimentoResources = $injector.get('MovimentoResources');
        $scope.itensPagamentoResources = $injector.get('ItemPagamentoResources');

        $scope.onAtualizarPosicao = function () {
            var posicaoContaCorrenteResources = $injector.get('PosicaoContaCorrenteResources');

            posicaoContaCorrenteResources.get({idCliente:1}).$promise.then(
                function (success) {
                    $scope.posicaoContas = success.item;

                }
            );
        };

        $scope.onDetalheMovimento = function(id, origem, tipo){

            if(origem == 1){
                $('#btnHomologar').hide();
            } else {
                $('#btnHomologar').show();
            }
            $scope.itens = {};
            $scope.movimentoResources.get({idMovimento:id}).$promise.then(
                function (success) {
                    $scope.detalheMovimento = success.item;

                    if(tipo != 'Deposito'){
                        $scope.itensPagamentoResources.get({idPagamento:id}).$promise.then(
                            function (success) {
                                $scope.itens = success.itens;
                            }
                        );
                    }

                }
            );

        }

        $scope.onPesquisaMovimentos = function(){
            $scope.movimentoResources.query({idCliente: 1, status : $scope.status, maxResults : $scope.maxResults, firstResult: $scope.firstResult, dataInicio:$scope.dataInicioP, dataFim:$scope.dataFimP}).$promise.then(
                function (success) {
                    $scope.movimentos = success.itens;
                }
            );

        };

        $scope.onPesquisaPorStatus = function(){
            $scope.dataInicioP = $scope.dataInicio.toLocaleDateString();
            $scope.dataFimP = $scope.dataFim.toLocaleDateString();

            $scope.onPesquisaMovimentos();
        }

        $scope.onMudarStatus = function(movimento,status){

            movimento.status = status;


            var homologarResources = $injector.get('HomologarResources');

            homologarResources.update({idMovimento: movimento.id},{}).$promise.then(
                function (success) {

                    $('#modalHomologa').modal('hide');

                    $scope.onPesquisaMovimentos();

                    $scope.onAtualizarPosicao();
                }
            );
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

            $scope.onPesquisaMovimentos();
        }

        $scope.onIncrementaResultado = function(){
            $scope.maxResults += $scope.registrosPorPagina;
            $scope.onPesquisaMovimentos();
        }



        $scope.printDiv = function(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var popupWin = window.open('', '_blank', 'width=700,height=500');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /><link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }

        $scope.onPesquisaPorStatus();
        $scope.onAtualizarPosicao();

    }]);
