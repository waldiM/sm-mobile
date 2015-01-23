var swissServices = angular.module('swissServices', ['ngResource', 'ngCookies']);

// REST requests
swissServices.factory('REST', ['$resource', 'API_SERVER', 'Auth', function($resource, API_SERVER, Auth){
    return {
        // login
        Login: function(){
            var token = Auth.get();
            return $resource(API_SERVER + 'login', {}, {
                 get: {method:'POST', params:{email:null, password:null}}
            });
        },
        // portfolio
        Portfolio: function(){
            var token = Auth.get();
            return $resource(API_SERVER + 'portfolio/:portfolioId', {}, {
                 get: {method:'GET', params:{portfolioId: null}, headers: { 'Accesstoken': token.hash } }
            });
        },
        // get notes
        Notes: function(){
            var token = Auth.get();
            return $resource(API_SERVER + 'notes/:companyId/:companyKind', {}, {
                 get: {method:'GET', params:{companyId: null, companyKind: null}, headers: { 'Accesstoken': token.hash } }
            });
        }
    }
}]);

// save/get auth cookie
swissServices.factory('Auth', ['$cookies', 'currentToken', function($cookies, currentToken){

    var ret = {};

    ret.put = function(value) {
        $cookies.smAppToken = value;
        currentToken.hash = value;
        return currentToken.hash;
    }

    ret.get = function() {
        var token = null;
        if(currentToken.hash == 'logout'){
            token = null;
        }
        else{
            token = currentToken.hash ? currentToken.hash : ($cookies.smAppToken ? $cookies.smAppToken : null);       
        }
        return {hash: token};
    }

    ret.logout = function(){
        currentToken.hash = 'logout';
        delete $cookies['smAppToken'];
        return currentToken.hash;
    }

    return ret;
}]);

