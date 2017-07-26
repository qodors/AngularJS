'use strict';
var app = typeof app !== "undefined" ? app : {};
app.controller('mainCtrl', ['jwtHelper', '$rootScope', '$scope', '$state', 'PostService', function Controller(jwtHelper, $rootScope, $scope, $state, PostService) {
        console.log("***** Main controller *****");
        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
            $rootScope.previousState = from.name;
            $rootScope.currentState = to.name;
            $rootScope.fromParams = fromParams;
            $rootScope.currentParams = toParams;
        });
        $rootScope.checkAuth = function () {
            if (sessionStorage.user) {
                $rootScope.user = JSON.parse(sessionStorage.getItem('user'));
                $rootScope.$broadcast('user');
                return true;
            } else {
                delete $rootScope.user;
                delete $rootScope.isUserLoggedIn;
                $rootScope.$broadcast('user');
                $rootScope.$broadcast('isUserLoggedIn');
                $state.go('login', {}, {reload: true});
                location.reload(true);
            }
        }
        var promis = PostService.loadposts();
        promis.then(function (response) {
            //console.log(response.data.data);
            if (response.data.error_code == 0) {
                $scope.posts = response.data.data;
            } else {
                $scope.err = response.data.message;
            }
        }, function (error) {
            console.log(error);
        });
        
       

    }]).controller('LoginCtrl', ['$scope', '$rootScope', '$http', 'ENV', '$state', 'UserService', function ($scope, $rootScope, $http, ENV, $state, UserService) {
        console.log("***** Login controller *****");
        UserService.UserLogout();
        angular.extend($scope, {
            login: function (loginForm) {
                UserService.login($scope.login, function (promis) {
                    promis.then(function (res) {
                        if (res.data.error_code == 0) {
                            var user = res.data.data;
                            UserService.setUser(user);
                            //Check previoud state to redirect after login
                            if ($rootScope.previousState == ''){
                                $state.go('home', {}, {reload: true});
                                location.reload(true);
                            }else {
                                $state.go($rootScope.previousState, {}, {reload: true});
                                location.reload(true);
                            }
                            
                        } else {
                            $scope.errors = res.data.message;
                        }
                    });
                });
            }
        });
    }]).controller('LogoutCtrl', ['$scope', '$rootScope', '$state', 'UserService', function ($scope, $rootScope, $state, UserService) {
        console.log("***** Logout controller *****");
        UserService.UserLogout($rootScope.user);
        $state.go('home', {}, {reload: true});
        location.reload(true);
    }]).controller('RegisterCtrl', ['$rootScope', '$scope', '$state', 'UserService', function ($rootScope, $scope, $state, UserService) {
        console.log("***** Registration controller *****");
        angular.extend($scope, {
            registration: function () {
                $scope.register = angular.merge({}, $scope.register, {'device_type': 'web', 'device_token': '192.168.0.158'});
                /*Call User Service to set user token and user's data*/
                UserService.register($scope.register, function (promis) {
                    promis.then(function (response) {
                        if (response.data.error_code == 0) {
                            var user = response.data.data;
                            UserService.setUser(user);
                            $state.go('home', {});
                            location.reload(true);
                        } else if (response.data.error_code == 1) {
                            $scope.err = response.data.message;
                        } else {
                            //console.log(response.data);
                        }
                    })
                });
            }
        });
    }]).controller('headerCtrl', ['$scope', '$rootScope', '$uibModal', function ($scope, $rootScope, $uibModal) {
        console.log("***** Haeder Controller *****");
        /*Check if user has logged in or not*/
        $rootScope.isUserLoggedIn = sessionStorage.isUserLoggedIn;
        $scope.user = $rootScope.user;

        $scope.addnewpost = function () {
            console.log("***** Add New Post Form *****");
            $rootScope.checkAuth();
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/addpost.html',
                controller: 'addpostmodal',
                scope: $scope,
            }).result.then(function (result) {
                if (result == 0) {
                    console.log(result == 0);
                    //$state.go('profile.content');
                } else {
                    console.log(result == 0);
                    //$state.go('profile.content');
                }
            });
        }
    }]).controller('AboutCtrl', ['$scope', function ($scope) {
        console.log("***** About Controller *****");
        $scope.awesomeThings = "test";
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }]).controller('addpostmodal', ['$scope', '$uibModalInstance', 'PostService', function ($scope, $uibModalInstance, PostService) {
        $scope.err = false;

        $scope.addpost = function (post) {
            console.log("***** Function to add Post *****");
            //console.log(post);
            var promis = PostService.add(post);
            promis.then(function (response) {
                if (response.data.error_code == 0) {
                    $uibModalInstance.close();
                    
                } else {
                    $scope.err = response.data.message;
                }
               //$state.go('home', {}, {reload: true});
                location.reload(true);
            }, function (error) {
                console.log(error);
            });

        }
    }])
