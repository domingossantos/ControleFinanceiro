'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp')
    .controller('DepositoCtrl',['$rootScope','$scope', '$injector', '$location','$timeout', '$q', '$log','MessageSrv', function ($rootScope, $scope, $injector, $location,$timeout, $q, $log,MessageSrv) {

        $scope.formasPagamento = [];
        $scope.contas = [];
        $scope.obras = [];
        $scope.planoContas = [];
        $scope.formaPagamentoSelecionada = null;
        $scope.obraSelecionada = null;
        $scope.contaSelecionada = null;
        $scope.planoContaSelecionado;
        $scope.valor = null;
        $scope.dataMovimento = null;
        $scope.depositos = [];

        $scope.deposito = {
            subConta : null,
            obra : null,
            descricao : null,
            valor : null,
            dataOperacao : null,
            planoConta : null
        }

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


        var now = new Date;
        var mes = parseInt(now.getMonth());
        $scope.mes = $scope.meses[mes];

        $scope.limparCampos = function(){
            $scope.formaPagamentoSelecionada = null;
            $scope.obraSelecionada = null;
            $scope.contaSelecionada = null;
            $scope.valor = null;
            $scope.dataMovimento = null;
        }

        var depositoResources = $injector.get('DepositoResources');

        $scope.onSalvar = function(){
            var data = $scope.dataMovimento.substring(4,8).concat('-'+$scope.dataMovimento.substring(2,4)).concat('-'+ $scope.dataMovimento.substring(0,2));
            var deposito = {
                contaCorrente : $scope.contaSelecionada,
                obra : $scope.obraSelecionada,
                descricao : 'Deposito',
                valor : $scope.valor,
                dataOperacao : data,
                status : 'PENDENTE_HOMOLOGACAO',
                planoConta : $scope.planoContaSelecionado
            }


            depositoResources.save({},angular.copy(deposito)).$promise.then(
                function (success) {

                    $scope.limparCampos();
                    MessageSrv.success('Pagamento Salvo');
                    $location.path('/main');
                }
            )
        }


        var planoContaResources = $injector.get('PlanoContaResources');

        planoContaResources.query({tipo : 'RECEITA'}).$promise.then(
            function (success) {
                $scope.planos = success.itens;
            }
        );


        var formaPagamantoResources = $injector.get('FormaPagamantoResources');

        formaPagamantoResources.query({}).$promise.then(
            function(success){
                $scope.formasPagamento = success.itens;
            }
        )

        var contaCorrenteResources = $injector.get('ContaCorrenteResources');

        contaCorrenteResources.query({}).$promise.then(
            function (success) {
                $scope.contas = success.itens;
            }
        );


        var obraResources = $injector.get('ObraResources');
        obraResources.query({idCliente:1}).$promise.then(
            function (success) {
                $scope.obras = success.itens;
            }
        );



        $scope.onPesquisar = function(){
            var mes = $scope.mes.id;
            var dataInicio = '01/'+mes+'/'+$scope.ano;
            var dataFim = $scope.getUltimoDiaMes(mes,$scope.ano)+'/'+mes+'/'+$scope.ano;

            depositoResources.query({dataInicio:dataInicio, dataFim:dataFim, status:$scope.status},
            function (success) {
                $scope.depositos = success;

                console.log(success);
            });
        }

        $scope.onDetalheDeposito = function (deposito) {
            $scope.deposito = deposito;
        }

    }]);
