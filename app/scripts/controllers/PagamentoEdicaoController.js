'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
    .controller('PagamentoEdicaoCtrl',['$rootScope','$scope', '$injector', '$location', '$routeParams', 'MessageSrv', function ($rootScope, $scope, $injector, $location, $routeParams, MessageSrv) {

        $scope.planosContas = [];
        $scope.fornecedores = [];
        $scope.obras = [];
        $scope.formasPagamento = [];
        $scope.contasCorrentes = [];
        $scope.gruposPlano = [];
        $scope.diferencaValor = 0;





        // Variaveis DataPickerOption
        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2000,1,1),
            startingDay: 1,

        };

        $scope.popupData = {
            opened: false
        };

        $scope.openPopupData = function() {
            $scope.popupData.opened = true;
        };

        $scope.altInputFormats = ['dd/MM/yyyy'];

        $scope.itemPagamento = {
            historico: null,
            valor: null,
            obra: null,
            fornecedor : null,
            planoConta : null
        }

        $scope.limparCampos = function () {
            $scope.itemPagamento = {
                historico: null,
                valor: null,
                obra: null,
                fornecedor : null,
                planoConta : null
            }
        }


        var formaPagamantoResources = $injector.get('FormaPagamantoResources');
        formaPagamantoResources.query({},function(success){
            $scope.formasPagamento = success.itens;
        });

        var contaCorrenteResources = $injector.get('ContaCorrenteResources');
        contaCorrenteResources.query({}).$promise.then(
            function (success) {
                $scope.contasCorrentes = success.itens;

            }
        );


        var pagamentoResources = $injector.get('PagamentoResources');

        $scope.onCarregaPagamento = function(idPagamento){
            pagamentoResources.get({idPagamento:idPagamento}).$promise.then(
                function (success) {
                    $scope.pagamento = success.item;
                    $scope.calculaDiferenca();
                    $scope.onCarregaItens();
                }
            )
        }

        if($routeParams.idPagamento != null) {
            $scope.onCarregaPagamento($routeParams.idPagamento);
        }

        var itemPagamentoResources = $injector.get('ItemPagamentoResources');
        $scope.onCarregaItens = function(){
            itemPagamentoResources.query({idPagamento:$scope.pagamento.id},function (success) {
                $scope.itensPagamento = success.itens;
            });
        }

        var obraResources = $injector.get('ObraResources');
        obraResources.query(function (success) {
            $scope.obras = success.itens;
        });

        var planoContaResources = $injector.get('PlanoContaResources');

        planoContaResources.query({idCliente:1,tipo:'GERAL'}, function (success) {
            $scope.gruposPlano = success.itens;
        });

        planoContaResources.query({tipo:'DESPESA'}).$promise.then(
            function (success) {
                for(var i = 0; i < success.itens.length; i++){
                    var itemPlano = {
                        planoConta : {},
                        descricao : null,
                        grupo:null
                    }

                    itemPlano.planoConta = success.itens[i];
                    itemPlano.descricao = success.itens[i].codigo + ' - '+ success.itens[i].descricao;

                    for(var x = 0; x < $scope.gruposPlano.length; x++ ){
                        var parte = success.itens[i].codigo.substring(0, 3);
                        if($scope.gruposPlano[x].codigo == parte){
                            itemPlano.grupo = $scope.gruposPlano[x].descricao;
                        }
                    }

                    $scope.planosContas[i] = itemPlano;
                }


            }
        );

        var fornecedorResources = $injector.get('FornecedorResources');
        fornecedorResources.query({}, function (success) {
            for(var i = 0; i < success.itens.length; i++){
                var itemFornecedor = {
                    fornecedor : {},
                    descricao : null
                }
                itemFornecedor.fornecedor = success.itens[i];
                itemFornecedor.descricao = success.itens[i].id + ' - '+ success.itens[i].nome;

                $scope.fornecedores[i] = itemFornecedor;
            }

        })


        $scope.onRegistraItem = function(){

            console.log($scope.itemPagamento);
            itemPagamentoResources.save({idPagamento:$scope.pagamento.id}
                ,angular.copy($scope.itemPagamento)).$promise.then(
                function (success) {
                    $scope.pagamento.valor += $scope.itemPagamento.valor;



                    $scope.onCarregaItens();
                    $scope.atualizarPagamento('RASCUNHO');
                    $scope.limparCampos();
                    $scope.calculaDiferenca();
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        $scope.onDeleteItem = function(item){

            itemPagamentoResources.delete({idItemPagamento:item.id}).$promise.then(
                function (success) {
                    $scope.pagamento.valor -= item.valor;
                    $scope.atualizarPagamento('RASCUNHO');
                    $scope.onCarregaItens();
                    $scope.calculaDiferenca();
                }
            );

        }

        $scope.atualizarPagamento = function(status){

            pagamentoResources.update({idPagamento: $scope.pagamento.id, status: status}
                ,angular.copy($scope.pagamento)).$promise.then(
                function (success) {
                    MessageSrv.info('Pagamento atualizado');
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        $scope.onSalvarRascunho = function () {
            $scope.atualizarPagamento('RASCUNHO');
            $location.path('/movimento/pagamento');
        }

        $scope.onSalvar = function () {
            if($scope.pagamento.valor == $scope.pagamento.valorEsperado){
                $scope.atualizarPagamento('PENDENTE_HOMOLOGACAO');
                $location.path('/movimento/pagamento');
            } else {
                MessageSrv.warning('Valor Total e diferente de Valor Esperado!');
            }


        }

        $scope.calculaDiferenca = function () {
            $scope.diferencaValor = $scope.pagamento.valorEsperado - $scope.pagamento.valor;
        }


    }]);
