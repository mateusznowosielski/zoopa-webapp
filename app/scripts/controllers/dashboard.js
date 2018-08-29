'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the businessWebApp
 */

angular.module('businessWebApp')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$timeout', 'FileUploader', 'OffersService', 'AppService', 'AuthenticateService', 'ErrorService',
  				  	         function ($scope,   $rootScope,   $timeout,   FileUploader,   OffersService,   AppService,   AuthenticateService,   ErrorService) {

  	$scope.moment = moment;
    $scope.parseInt = parseInt;

    $scope.offers = null;
    $scope.editing = false;
    $scope.selectedOffer = null;
    $scope.offerSubmitted = false;
    $scope.publishedOffersExist = false;
    $scope.unpublishedOffersExist = false;
    $scope.files = [];

    $scope.offerStatus = {1: 'Draft', 2: 'Published', 3: 'Unpublished', 4: 'Expired', 5: 'Terminated'};

    $scope.getOfferStatus = function(offer) {

      return $scope.isOfferExpired(offer) ? "Expired" : $scope.offerStatus[offer.status];
    }

    function getOffers() {

      OffersService.getOffers().then(
        function(data) {
          var offers = [];
          $scope.publishedOffersExist = false;
          $scope.unpublishedOffersExist = false;
          angular.forEach(data, function(dataOffer) {
            var offer = deserializeOffer(dataOffer);
            offers.push(offer);
            if($scope.isOfferPublished(offer)) {
              $scope.publishedOffersExist = true;
            }
            if($scope.isOfferUnpublished(offer)) {
              $scope.unpublishedOffersExist = true;
            }
          });
          $scope.offers = offers;
        },
        function(error) {
          $scope.offers = null;
          ErrorService.showMessage(error);
        }
      );
    }

    getOffers();

    $scope.isOfferUnpublished = function(offer) {
      return offer.status === 1 || offer.status === 3 || offer.status === 4 || offer.status === 5;
    }

    $scope.isOfferPublished = function(offer) {
      return offer.status === 2;
    }

    $scope.publishOffer = function(event, offerId) {

      if($rootScope.business.is_trial && _.find($scope.offers, {status: 2})) {
        event.stopImmediatePropagation();
        $rootScope.$emit('showAlert', 'error', "Your account is TRIAL, you are allowed to publish only one offer at a time. To upgrade and unlock all features please contact us at contact@thezoopa.com.");
        return;
      }

      OffersService.publishOffer(offerId).then(
        function(data) {
          var offer = _.find($scope.offers, {id:offerId});
          offer.status = 2;
        },
        function(error) {
          ErrorService.showMessage(error);
        }
      );

      event.stopImmediatePropagation();
    }

    $scope.unpublishOffer = function(event, offerId) {

      OffersService.unpublishOffer(offerId).then(
        function(data) {
          var offer = _.find($scope.offers, {id:offerId});
          offer.status = 3;
        },
        function(error) {
          ErrorService.showMessage(error);
        }
      );

      event.stopImmediatePropagation();
    }

    $scope.isOfferReadOnly = function(status_id) {
      return status === 4 || status === 5;
    }

    function buildOfferObject(offer) {

      offer.datePicker = {};
      offer.datePicker.opened = false;
      offer.datePicker.min_date = new Date();

    }

    $scope.addOffer = function() {

      $scope.cancelEditingOffer();

      $timeout(function() {
        $scope.editing = true;
        $scope.selectedOffer = {};
        buildOfferObject($scope.selectedOffer);
      });
      
    }

    $scope.selectOffer = function(offer) {

      $scope.cancelEditingOffer();

      $timeout(function() {
        $scope.editing = true;
        $scope.selectedOffer = angular.copy(offer);
        buildOfferObject($scope.selectedOffer);
      });

    }

    $scope.deleteOffer = function(offerId) {

      OffersService.deleteOffer(offerId).then(
        function(data) {

          uploader.clearQueue();
          clearValidation(); 
          $scope.selectedOffer = null;
          $scope.editing = false;
          getOffers();
          
          $rootScope.$emit('showAlert', 'success', 'Offer was deleted successfully.');
        },
        function(error) {
          ErrorService.showMessage(error);
        }
      );
    }

    $scope.cancelEditingOffer = function() {

      uploader.clearQueue();
      clearValidation();
      $scope.editing = false;
      $scope.selectedOffer = null;
    }

    $scope.formatData = function(date) {

      return moment(date).format('DD MMM YYYY')
    }

    var uploader = $scope.uploader = new FileUploader();

    function deserializeOffer(offer) {

      var deserializedOffer = angular.copy(offer);
      deserializedOffer.price_original = offer.price_original / 100;
      deserializedOffer.price_discounted = offer.price_discounted / 100;
      var price_desericalized_split = deserializedOffer.price_discounted.toString().split(".");
      if(price_desericalized_split.length === 2) {
        deserializedOffer.price_discounted_integer = price_desericalized_split[0] + ".";
        deserializedOffer.price_discounted_decimal = price_desericalized_split[1].length === 2 ? price_desericalized_split[1] : price_desericalized_split[1] + "0";
      }
      else {
        deserializedOffer.price_discounted_integer = deserializedOffer.price_discounted + ".";
        deserializedOffer.price_discounted_decimal = "00";
      }
      deserializedOffer.expiration_date_string = moment(parseInt(offer.expire_at) * 1000).format('DD MMM YYYY');

      return deserializedOffer;
    }

    function serializeOffer(offer) {

      var serializedOffer = {};
      serializedOffer.name = offer.name;
      serializedOffer.headline = offer.headline;
      serializedOffer.body = offer.body;
      serializedOffer.price_original = offer.price_original * 100;
      serializedOffer.price_discounted = offer.price_discounted * 100;
      serializedOffer.quantity = offer.quantity;
      serializedOffer.expire_at = parseInt(new Date(offer.expiration_date_string).getTime() / 1000);
      if(offer.image_data) {
        serializedOffer.image_data = offer.image_data;
      }

      return serializedOffer;
    }

    function clearValidation() {

      $scope.offerSubmitted = false;
      $scope.nameBlurred = false;
      $scope.headlineBlurred = false;
      $scope.originalPriceBlurred = false;
      $scope.discountPriceBlurred = false;
      $scope.counterOriginalBlurred = false;
      $scope.expirationDateBlurred = false;
      $scope.bodyBlurred = false;
    }

    $scope.isOfferExpired = function(offer) {

      return offer.expire_at * 1000 < (new Date()).getTime();
    }

    $scope.saveOffer = function(offerId) {

      $scope.offerSubmitted = true;

      $timeout(function() {

        console.log($scope.$$childTail.offerForm);

        if($scope.$$childTail.offerForm.$valid && $scope.validImageOffer()) {

          var serializedOffer = serializeOffer($scope.selectedOffer);

          if(angular.isDefined(offerId)) {
            OffersService.editOffer(offerId, serializedOffer).then(
              function(data) {
                getOffers();
                clearValidation();
                $scope.selectedOffer = null;
                $scope.editing = false;

                uploader.clearQueue();

                $rootScope.$emit('showAlert', 'success', 'Offer was saved successfully.');
              },
              function(error) {
                ErrorService.showMessage(error);
              }
            );
          }
          else {
            OffersService.createOffer(serializedOffer).then(
              function(data) {
                getOffers();
                clearValidation();
                $scope.selectedOffer = null;
                $scope.editing = false;

                uploader.clearQueue();

                $rootScope.$emit('showAlert', 'success', 'Offer was saved successfully.');
              },
              function(error) {
                ErrorService.showMessage(error);
              }
            );
          }

        }
      });
    }

    $scope.validImageOffer = function() {
      //return (!$scope.selectedOffer.image_url || uploader.queue.length == 0) && ($scope.imageBlurred || $scope.offerSubmitted);

      if(!$scope.imageBlurred && !$scope.offerSubmitted) {
        return true;
      }

      if($scope.selectedOffer.image_url || uploader.queue.length > 0) {
        return true;
      }

      return false;

    }

    // FILTERS

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        //console.info('onWhenAddingFileFailed', item, filter, options);

        uploader.clearQueue();
        uploader.addToQueue([item]);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);

        uploader.clearQueue();

        $rootScope.$emit('showAlert', 'error', "Image couldn't be uploaded.");
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');

        getOffers();
        clearValidation();
        $scope.selectedOffer = null;
        $scope.editing = false;

        uploader.clearQueue();

        $rootScope.$emit('showAlert', 'success', 'Offer was saved successfully.');
    };

  $scope.openDatePicker = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    if(!$scope.selectedOffer.status_id || !$scope.isOfferReadOnly($scope.selectedOffer.status_id)) {
      $timeout(function() {  
        $scope.selectedOffer.datePicker.opened = true;
      });
    }
  };

  $scope.imageReady = function(image_data) {
    $scope.$apply(function() {
      $scope.selectedOffer.image_data = image_data;
    });
  }


}]);
