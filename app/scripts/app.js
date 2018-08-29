'use strict';

/**
 * @ngdoc overview
 * @name businessWebApp
 * @description
 * # businessWebApp
 *
 * Main module of the application.
 */
angular
  .module('businessWebApp')
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
   function($stateProvider,   $urlRouterProvider,   $httpProvider,   $locationProvider ) {

  //$urlRouterProvider.otherwise('login');

  $stateProvider
  .state('login', {
    url: '/login',
    views: {
      'content': {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('accountCreation', {
    url: '/register?email&agreement',
    views: {
      'content': {
        templateUrl: 'views/account/account-creation.html',
        controller: 'AccountCreationCtrl'
      }
    }
  })
  .state('companyCreation', {
    url: '/create',
    views: {
      'content': {
        templateUrl: 'views/account/company-creation.html',
        controller: 'CompanyCreationCtrl'
      }
    }
  })
  .state('forgotPassword', {
    url: '/forgotPassword',
    views: {
      'content': {
        templateUrl: 'views/account/forgot-password.html',
        controller: 'ForgotPasswordCtrl'
      }
    }
  })
  .state('main', {
    abstract: true,
    views: {
      'content': {
        templateUrl: 'views/main.html'
      }
    }
  })
  .state('main.dashboard', {
    url: '/dashboard',
    views: {
      'content': {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  })
  .state('main.settings', {
    abstract: true,
    views: {
      'content': {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })
  .state('main.settings.company', {
    //url: '/company',
    abstract: true,
    views: {
      'content': {
        templateUrl: 'views/settings/company.html',
        controller: 'CompanyCtrl'
      }
    }
  })
  .state('main.settings.company.account', {
    url: '/companyAccount',
    views: {
      'content': {
        templateUrl: 'views/settings/company/company-account.html',
        controller: 'CompanyAccountCtrl'
      }
    }
  })
  .state('main.settings.company.data', {
    url: '/companyData',
    views: {
      'content': {
        templateUrl: 'views/settings/company/company-data.html',
        controller: 'CompanyDataCtrl'
      }
    }
  })
  .state('main.settings.company.hours', {
    url: '/companyHours',
    views: {
      'content': {
        templateUrl: 'views/settings/company/company-hours.html',
        controller: 'CompanyHoursCtrl'
      }
    }
  })
  .state('main.settings.company.billing', {
    url: '/companyBilling',
    views: {
      'content': {
        templateUrl: 'views/settings/company/company-billing.html',
        controller: 'CompanyBillingCtrl'
      }
    }
  })
  .state('main.settings.payouts', {
    url: '/payouts',
    views: {
      'content': {
        templateUrl: 'views/settings/payouts.html',
        controller: 'PayoutsCtrl'
      }
    }
  })
  .state('main.settings.devices', {
    url: '/devices',
    views: {
      'content': {
        templateUrl: 'views/settings/devices.html',
        controller: 'DevicesCtrl'
      }
    }
  })
  .state('main.settings.reports', {
    url: '/reports',
    views: {
      'content': {
        templateUrl: 'views/settings/reports.html',
        controller: 'ReportsCtrl'
      }
    }
  })

  $httpProvider.interceptors.push('HttpInterceptor');

}]).run(['$rootScope', '$state', '$modal', 'AuthenticateService', 'BusinessService', 'BillingService',
 function($rootScope,   $state,   $modal,   AuthenticateService,   BusinessService,   BillingService) {

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

    var loadDetails = function() {

      return BusinessService.getBusiness()
        .then(function(businessResponse) {
          $rootScope.business = businessResponse;
          return BillingService.getAccounts();
        })
        .then(function(accountsData) {
          $rootScope.accounts = accountsData;
        });
    }

    //console.log('stateChange', event, toState, fromState);

    if(toState.name !== 'login' &&
       toState.name !== 'accountCreation' &&
       toState.name !== 'forgotPassword') {


      if(AuthenticateService.getAccessToken()) {

        // we have access token

        if(!fromState.name && !$rootScope.business) {
          event.preventDefault();
          // first state and no business
          loadDetails().then(
            function(detailsResponse) {
              // details successfull we move to dashboard
              //console.log('details successfull we move to dashboard');
              $state.go(toState.name);
            },
            function(detailsError) {
              AuthenticateService.refreshAccessToken()
              .then(loadDetails)
              .then(function(response) {
                // details NOT successfull we refreshed token and move to dashboard
                //console.log('details NOT successfull we refreshed token and move to dashboard');
                $state.go(toState.name);
              },
              function(error) {
                // details NOT successfull refresh token EXPIRED we go to login
                //var message = error.data.error_description ? error.data.error_description : error.data.message;
                $rootScope.$emit('showAlert', 'error', "You were logged out.");
                //console.log('details NOT successfull refresh token EXPIRED we go to login');
                $state.go('login');
              });
            }
          );
        }
      }
      else {
        // explicit login
        event.preventDefault();
        //console.log('explicit login'); 
        $state.go('login');
      }
    }
  });

  if(!$state.current.name) {
    $state.go('main.dashboard');
  }

  $rootScope.openTermsConditions = function() {

    var modalInstance = $modal.open({
      templateUrl: 'views/account/terms-conditions.html',
      controller: 'TermsConditionsCtrl',
      size: 'lg'
    });

    modalInstance.result.then(
      function (selectedItem) {
      },
      function () {
      }
    );
  }

  $rootScope.openPrivacyPolicy = function() {

    var modalInstance = $modal.open({
      templateUrl: 'views/account/privacy-policy.html',
      controller: 'PrivacyPolicyCtrl',
      size: 'lg'
    });

    modalInstance.result.then(
      function (selectedItem) {
      },
      function () {
      }
    );
  }
  
}]);