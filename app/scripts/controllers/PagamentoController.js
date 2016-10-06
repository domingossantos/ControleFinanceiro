'use strict';
/**
 * Created by domingossantos on 07/08/16.
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('PagamentoCtrl',['$rootScope','$scope', '$injector', '$location', 'growl', function ($rootScope, $scope, $injector, $location, growl) {

    $scope.formasPagamento = [];
    $scope.contas = [];
    $scope.obras = [];
    $scope.planosContas = [];
    $scope.fornecedores = [];
    $scope.notificacao = null;
    $scope.showNotification = false;

    $scope.itensPagamento = [];
    $scope.formaPagamentoSelecionada = null;
    $scope.obraSelecionada = null;
    $scope.contaSelecionada = null;
    $scope.planoContaSelecionado = null;
    $scope.fornecedorSelecionado = null;
    $scope.descricao = null;
    $scope.historico = null;
    $scope.valor = null;
    $scope.dataMovimento = null;

    $scope.valorTotal = 0;


    $scope.limparItem = function(){
      $scope.obraSelecionada = null;
      $scope.planoContaSelecionado = null;
      $scope.fornecedorSelecionado = null;
      $scope.historico = null;
      $scope.valor = null;
    }

    $scope.resetCampos = function(){
      $scope.itensPagamento = [];
      $scope.formaPagamentoSelecionada = null;
      $scope.obraSelecionada = null;
      $scope.contaSelecionada = null;
      $scope.planoContaSelecionado = null;
      $scope.fornecedorSelecionado = null;
      $scope.historico = null;
      $scope.valor = null;
      $scope.dataMovimento = null;
      $scope.valorTotal = 0;
      $scope.descricao = null;
      $scope.planoDigitado = null;
      $scope.fornecedorDigitado = null;
    }

    $scope.validaCampos = function(){
      var valido = true;

      if($scope.formaPagamentoSelecionada == null){
        valido = false;
      }
      if($scope.obraSelecionada == null){
        valido = false;
      }
      if($scope.contaSelecionada == null){
        valido = false;
      }
      if($scope.planoContaSelecionado == null){
        valido = false;
      }
      if($scope.fornecedorSelecionado == null){
        valido = false;
      }
      if($scope.historico == null){
        valido = false;
      }
      if($scope.valor == null){
        valido = false;
      }

      return valido;
    }

    $scope.onSalvar = function(){

      var data = $scope.dataMovimento.substring(4,8).concat('-'+$scope.dataMovimento.substring(2,4)).concat('-'+ $scope.dataMovimento.substring(0,2));

      var pagamentoResources = $injector.get('PagamentoResources');

      var pagamento = {
        descricao: $scope.descricao,
        status : 'PENDENTE_HOMOLOGACAO',
        valor : $scope.valorTotal,
        dataOperacao : data,
        detalhePagamento : {
          formaPagamento : $scope.formaPagamentoSelecionada
        }
      }

      var itensPagamento = $scope.itensPagamento;

      pagamentoResources.save({idContaCorrente: $scope.contaSelecionada.id}
                              ,pagamento).$promise.then(
        function (success) {
          var itemPagamentoResources = $injector.get('ItemPagamentoResources');
          console.log(itensPagamento);
          itemPagamentoResources.save({idPagamento:success.item.id},angular.copy(itensPagamento)).$promise.then(
            function (success) {
              console.log(success)
              growl.info('Registro Salvo');
              $scope.resetCampos();

            }
          )
        }
      );
    }

    $scope.onRegistraItem = function(){
      if($scope.validaCampos()){

        console.log($scope.planoContaSelecionado);
        var item = {
          historico: $scope.historico,
          valor: $scope.valor,
          obra: $scope.obraSelecionada,
          fornecedor : $scope.fornecedorSelecionado,
          planoConta : $scope.planoContaSelecionado
        }
        console.log(item);

        $scope.valorTotal = $scope.valorTotal + $scope.valor;

        $scope.itensPagamento.push(item);

        $('#btnSalvar').removeAttr('disabled');
        $scope.limparItem();
      } else {
        growl.warning('Todos os campos de item de pagamento são obrigadótios!');
      }

    }


    $scope.onDeleteItem = function(item){
      var index = $scope.itensPagamento.indexOf(item);
      $scope.itensPagamento.splice(index,1);

      $scope.valorTotal = $scope.valorTotal - item.valor;

      if($scope.itensPagamento.length <= 0 ){
        $('#btnSalvar').attr('disabled','disabled');
      }
    }

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
    obraResources.query().$promise.then(
      function (success) {
        $scope.obras = success.itens;
      }
    );


    var planoContaResources = $injector.get('PlanoContaResources');

    planoContaResources.query({idCliente:1,tipo:'DESPESA'}).$promise.then(
      function (success) {
        for(var i = 0; i < success.itens.length; i++){

          var itemPlano = {
            planoConta : {},
            descricao : null
          }
          itemPlano.planoConta = success.itens[i];
          itemPlano.descricao = success.itens[i].codigo + ' - '+ success.itens[i].descricao;

          $scope.planosContas[i] = itemPlano;
        }
      }
    );

    var fornecedorResources = $injector.get('FornecedorResources');
    fornecedorResources.query({idCliente:1}).$promise.then(
      function (success) {

        for(var i = 0; i < success.itens.length; i++){
          var itemFornecedor = {
            fornecedor : {},
            descricao : null
          }
          itemFornecedor.fornecedor = success.itens[i];
          itemFornecedor.descricao = success.itens[i].id + ' - '+ success.itens[i].nome;

          $scope.fornecedores[i] = itemFornecedor;
        }
        console.log($scope.fornecedores);
      }
    );



  }]);
