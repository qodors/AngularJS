'use strict';

/**
 * @ngdoc overview
 * @name newApp
 * @description
 * # newApp
 *
 * Main module of the application.
 */
var app = angular.module('newApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngParallax',
    'ui.router',
    'ui.bootstrap',
    'angular-jwt',
    'ngMessages',
    'google.places'
]).run(function ($rootScope, $state, $location, $http, $timeout) {
    var url = $location.absUrl().split('!')[0];
    $rootScope.path = $location.path();

    if (!sessionStorage.isUserLoggedIn || sessionStorage.isUserLoggedIn == false) {
        localStorage.Authorization = 'guest';
        delete sessionStorage.isUserLoggedIn;
        delete sessionStorage.user;
        delete $rootScope.user;
    } else {
        $rootScope.user = JSON.parse(sessionStorage.getItem('user'));
    }

    $http.defaults.headers.common['Authorization'] = localStorage.getItem('Authorization');
    $http.defaults.headers.common["Content-Type"] = "application/json";
}).config(function ($urlRouterProvider, $provide, $qProvider, $stateProvider, $locationProvider, $httpProvider, jwtOptionsProvider) {

    if (!localStorage.getItem('Authorization'))
        localStorage.setItem('Authorization', 'guest');

    $qProvider.errorOnUnhandledRejections(false);

    jwtOptionsProvider.config({
        authPrefix: '',
        whiteListedDomains: ['192.168.0.158'],
        tokenGetter: function () {
            return localStorage.getItem('Authorization') | 'guest';
        }
    });
    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push(function ($q) {
        return {
            'responseError': function (rejection) {
                var defer = $q.defer();
                if (rejection.status == 401) {
                    console.log('401');
                    localStorage.setItem('Authorization', 'guest');
                    delete sessionStorage.isUserLoggedIn;
                    delete sessionStorage.user;
                    delete $rootScope.user;
                    delete $rootScope.isUserLoggedIn;
                    $rootScope.$broadcast('user');
                    $rootScope.$broadcast('isUserLoggedIn');
                    window.reload();
                    $state.reload($rootScope.currentState, $rootScope.currentParams);
                }
                defer.reject(rejection);
                return defer.promise;
            }
        }
    });
    var interceptor = ['$rootScope', '$q', "Base64", function (scope, $q, Base64) {
            function success(response) {
                return response;
            }

            function error(response) {
                var status = response.status;
                if (status == 401) {
                    //AuthFactory.clearUser();
                    //console.log('401');
                    localStorage.setItem('Authorization', 'guest');
                    delete sessionStorage.isUserLoggedIn;
                    delete sessionStorage.user;
                    $state.reload($rootScope.currentState, $rootScope.currentParams);
                    return;
                }
                // otherwise
                return $q.reject(response);
            }
            return function (promise) {
                return promise.then(success, error);
            }
        }];
    $stateProvider.state({
        name: 'home',
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'mainCtrl',
    }).state({
        name: 'about',
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
    }).state({
        name: 'register',
        url: '/register',
        controller: 'RegisterCtrl',
        templateUrl: 'views/register.html',
    }).state({
        name: 'login',
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'views/login.html',
    }).state({
        name: 'logout',
        url: '/logout',
        controller: 'LogoutCtrl',
    })
    $urlRouterProvider
            .otherwise('/404');
    $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');
    //$urlRouterProvider.otherwise('/');
});