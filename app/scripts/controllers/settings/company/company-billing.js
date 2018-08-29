'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:CompanyBillingCtrl
 * @description
 * # CompanyBillingCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('CompanyBillingCtrl', ['$scope', '$rootScope', '$timeout', 'BillingService', 'ErrorService',
  				            function ($scope,   $rootScope,   $timeout,   BillingService,   ErrorService) {

    $scope.newAccount = null;
    $scope.editedAccount = null;

 	function resetNewFormValidation() {

        $scope.newAccountForm.$setPristine();
        $scope.newAccountForm.$setUntouched();
    }

    function resetEditedFormValidation() {

        $scope.$$childHead.editedAccountForm.$setPristine();
        $scope.$$childHead.editedAccountForm.$setUntouched();
    }

    $timeout(resetNewFormValidation);

    $scope.isNewInvalid = function(name, validation) {

    	return ($scope.newAccountForm.$submitted || $scope.newAccountForm[name].$touched) &&
    			$scope.newAccountForm[name].$error[validation];
    }

    $scope.isEditedInvalid = function(name, validation) {

        if(!$scope.editedAccount) {
            return;
        }

    	return ($scope.$$childHead.editedAccountForm.$submitted || $scope.$$childHead.editedAccountForm[name].$touched) &&
    			$scope.$$childHead.editedAccountForm[name].$error[validation];
    }

    function getAccounts() {

      BillingService.getAccounts().then(
        function(data) {
          $rootScope.accounts = data;
        },
        function(error) {
          ErrorService.showMessage(error);
        }
      );
    }

    getAccounts();

    $scope.createAccount = function(account) {

        $scope.newAccountForm.$setSubmitted();

        $timeout(function() {

            if($scope.newAccountForm.$valid) {

                BillingService.createAccount(account).then(
                    function(data) {

                        getAccounts();

                        $scope.newAccount = null;
                        $timeout(resetNewFormValidation);

                        $rootScope.$emit('showAlert', 'success', 'Account was added successfully.');
                    },
                    function(error) {
                        ErrorService.showMessage(error);
                    }
                );
            }
        });

    }


    $scope.editAccount = function(id) {

    	var account = _.find($scope.accounts, {id:id});
        account.editing = true;
    	$scope.editedAccount = angular.copy(account);

        $timeout(resetEditedFormValidation);
    }

    $scope.cancelEditingAccount = function(id) {

    	var account = _.find($scope.accounts, {id:id});
        resetEditedFormValidation();
    	account.editing = false;
        $scope.editedAccount = null;
    }

    $scope.saveAccount = function(id, account) {

        $scope.$$childHead.editedAccountForm.$setSubmitted();

        $timeout(function() {

            if($scope.$$childHead.editedAccountForm.$valid) {

                BillingService.saveAccount(id, account.tax_id, account.label).then(
                    function(data) {

                        getAccounts();

                        resetEditedFormValidation();
                        $scope.editedAccount = null;
                        
                        $rootScope.$emit('showAlert', 'success', 'Account was saved successfully.');
                    },
                    function(error) {
                        ErrorService.showMessage(error);
                    }
                );
            }
        });
    }

    $scope.deleteAccount = function(id) {

        BillingService.deleteAccount(id).then(
            function(data) {
                getAccounts();
                $rootScope.$emit('showAlert', 'success', 'Account was deleted successfully.');
            },
            function(error) {
                ErrorService.showMessage(error);
            }
        );
    }

	$scope.makeDefaultAccount = function(event, id, isDefault) {

        if(!isDefault) {
            event.preventDefault();
            return;
        }

        BillingService.makeDefaultAccount(id).then(
            function(data) {
                getAccounts();
                $rootScope.$emit('showAlert', 'success', 'Account is now default.');
            },
            function(error) {
                ErrorService.showMessage(error);
            }
        );
    }
}]);