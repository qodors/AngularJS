var app = typeof app !== "undefined" ? app : {};
app.factory('UserService', ['$http', 'ENV', '$rootScope', function ($http, ENV, $rootScope) {
        var service = {};
        service.register = function (reg, callback) {
            callback($http({
                url: ENV.API + 'user/register',
                method: 'POST',
                data: reg
            }).then(handleSuccess, handelError)
                    )
        }
        service.setUser = function (user_details) {
            sessionStorage.isUserLoggedIn = true;
            localStorage.setItem('Authorization', user_details.token);
            return sessionStorage.setItem('user', JSON.stringify(user_details));
        }
        service.login = function (login, callback) {
            callback($http({
                url: ENV.API + 'user/login',
                method: 'POST',
                data: {
                    "email": login.email,
                    "password": login.password,
                    "device_type": "web",
                },
            }).then(handleSuccess, handelError)
                    )
        }
        service.UserLogout = function () {
            localStorage.setItem('Authorization', 'guest');
            delete sessionStorage.isUserLoggedIn;
            return delete sessionStorage.user;
        }
        function handleSuccess(response) {
            console.log(response);
            return response;
        }
        function handelError(data) {
            return function () {
                return {success: false, message: data};
            };
        }
        return service;
    }]).factory('PostService', ['$http', 'ENV', function ($http, ENV) {
        var service = {}
        service.add = function (post) {
            //console.log(post);
            return $http({
                url: ENV.API + 'posts',
                method: 'POST',
                data: post
            }).then(handleSuccess, handelError)
        }
        service.loadposts = function(){
            return $http({
                url: ENV.API + 'posts',
                method: 'GET'
            }).then(handleSuccess, handelError)
        }
        function handleSuccess(response) {
            return response;
        }
        function handelError(data) {
            return function () {
                return {success: false, message: data};
            };
        }
        return service;
    }])
