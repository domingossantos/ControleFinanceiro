'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
    .controller('PagamentoEdicaoCtrl',['$rootScope','$scope', '$injector', '$location', '$routeParams', 'MessageSrv','FormatosSrv','CookiesSrv', function ($rootScope, $scope, $injector, $location, $routeParams, MessageSrv, FormatosSrv, CookiesSrv) {

        $scope.planosContas = [];
        $scope.fornecedores = [];
        $scope.obras = [];
        $scope.formasPagamento = [];
        $scope.contasCorrentes = [];
        $scope.gruposPlano = [];
        $scope.diferencaValor = 0;
        $scope.dataEdicao = null;
        $scope.obraSelecionada = null;
        $scope.contaSelecionada = null;
        $scope.formaSelecionada = null;
        $scope.botaoSalvar = false;

        $scope.contasP = [];

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
        contaCorrenteResources.query({}, function (success) {
            $scope.contasCorrentes = success.itens;
        });


        if($routeParams.idPagamento != null) {
            var pagamentoResources = $injector.get('PagamentoResources');

            pagamentoResources.query({idPagamento:$routeParams.idPagamento}, function (success) {
                    $scope.pagamento = success.item;
                    $scope.dataEdicao = FormatosSrv.dataBR($scope.pagamento.dataOperacao);
                    $scope.calculaDiferenca();
                    $scope.onCarregaItens();
                    $scope.contaSelecionada = $scope.pagamento.contaCorrente;
                    $scope.formaSelecionada = $scope.pagamento.detalhePagamento.formaPagamento;

            });
        }

        var itemPagamentoResources = $injector.get('ItemPagamentoResources');
        $scope.onCarregaItens = function(){
            itemPagamentoResources.query({idPagamento:$scope.pagamento.id},function (success) {
                $scope.itensPagamento = success.itens;
                var valorTotal = 0;
                for(var i = 0; success.itens.length > i; i++){
                    valorTotal += success.itens[i].valor;
                }
                $scope.pagamento.valor = valorTotal;


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
                        id:null,
                        planoConta : {},
                        descricao : null,
                        grupo:null
                    }

                    itemPlano.id = success.itens[i].id;
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
                    id:null,
                    fornecedor : {},
                    descricao : null
                }
                itemFornecedor.id = success.itens[i].id;
                itemFornecedor.fornecedor = success.itens[i];
                itemFornecedor.descricao = success.itens[i].id + ' - '+ success.itens[i].nome;

                $scope.fornecedores[i] = itemFornecedor;
            }

        })


        $scope.onRegistraItem = function(){
            itemPagamentoResources.save({idPagamento:$scope.pagamento.id}
                ,angular.copy($scope.itemPagamento)).$promise.then(
                function (success) {
                    $scope.pagamento.valor += $scope.itemPagamento.valor;

                    $scope.onCarregaItens();
                    $scope.limparCampos();
                    $scope.calculaDiferenca();
                    $scope.atualizarPagamento('RASCUNHO','ATIVO');

                    $('#modalInserir').modal('hide');
                    $scope.botaoSalvar = false;
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        $scope.onCarregaItem = function(item){
            $scope.itemPagamento = item;


            $('#modalEditar').modal('show');
        }

        $scope.onAtualizaItem = function(item){

            itemPagamentoResources.update({idItemPagamento:$scope.itemPagamento.id},
            angular.copy($scope.itemPagamento)).$promise.then(
                function(success){
                    $scope.limparCampos();
                    $scope.onCarregaItens();
                    $scope.calculaDiferenca();
                    $scope.atualizarPagamento('RASCUNHO','ATIVO');

                    MessageSrv.success(success.mensagem);
                    $('#modalEditar').modal('hide');
                }
            );

        }

        $scope.onDeleteItem = function(item){

            itemPagamentoResources.delete({idItemPagamento:item.id}).$promise.then(
                function (success) {
                    $scope.pagamento.valor -= item.valor;
                    $scope.atualizarPagamento('RASCUNHO','ATIVO');
                    $scope.onCarregaItens();
                    $scope.calculaDiferenca();
                }
            );
        }

        $scope.atualizarPagamento = function(statusPagamento, situacaoRegistro){

            $scope.pagamento.contaCorrente = $scope.contaSelecionada;
            $scope.pagamento.detalhePagamento.formaPagamento = $scope.formaSelecionada;



            pagamentoResources.update({idPagamento: $scope.pagamento.id, statusPagamento: statusPagamento, statusRegistro: situacaoRegistro}
                ,angular.copy($scope.pagamento)).$promise.then(
                function (success) {
                    MessageSrv.info('Pagamento atualizado');
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        $scope.onAtualizarPagamento = function(){

            if($scope.pagamento.valor == $scope.pagamento.valorEsperado){

                $scope.pagamento.contaCorrente = $scope.contaSelecionada;
                $scope.atualizarPagamento('PENDENTE_HOMOLOGACAO','ATIVO');
                $location.path('/movimento/pagamento');
                CookiesSrv.setAtributo('retorno',1);
            } else {
                MessageSrv.warning('Valor Total é diferente do Valor Esperado!');
            }
        }

        $scope.onSalvarRascunho = function () {
            $scope.atualizarPagamento('RASCUNHO','ATIVO');
            $location.path('/movimento/pagamento');
            $rootScope.atualizar = true;
        }

        $scope.onSalvar = function () {
            if($scope.pagamento.valor == $scope.pagamento.valorEsperado){
                $scope.atualizarPagamento('PENDENTE_HOMOLOGACAO','ATIVO');
                $location.path('/movimento/pagamento');
            } else {
                MessageSrv.warning('Valor Total e diferente de Valor Esperado!');
            }


        }

        $scope.calculaDiferenca = function () {
            $scope.diferencaValor = $scope.pagamento.valorEsperado - $scope.pagamento.valor;
        }


    }]);
