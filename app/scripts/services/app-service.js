
'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:AppService
 * @description
 * # AppService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('AppService', ['config', function (config) {

    // var host = "http://keyboarders.itl.pl";
    // var services = {
    //   access_token: "zoopa/public/api/v1/access_token",
    //   offers: "zoopa/public/api/v1/business/offers",
    //   devices: "zoopa/public/api/v1/business/devices",
    //   business: "zoopa/public/api/v1/business"
    // };

    var host = config.host;
    var services = {
      access_token: "api/v2/access_token",
      offers: "api/v2/business/offers",
      devices: "api/v2/business/devices",
      business: "api/v2/business",
      billing: "api/v2/business/accounts",
      payouts: "api/v2/business/payouts"
    };

    var map = {
      api: "https://maps.googleapis.com/maps/api/",
      service: {
        geocode: "geocode"
      },
      key: "AIzaSyAJnCt5bN5HSeiJHkhJ1I21hBhsVJuNIXo"
    }

    return {

      host: host,
      services: services,
      map: map

    };

  }]);