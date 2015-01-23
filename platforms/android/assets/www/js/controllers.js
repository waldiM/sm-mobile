var swissCntls = angular.module('swissCntls', []);

//Login controller
swissCntls.controller('loginController', ['$scope', '$rootScope', '$location', 'Auth', 'REST', function($scope, $rootScope, $location, Auth, REST) {

    app.hideMenu();

    //if is logged not show login button
    var token = Auth.get();
    $rootScope.notLogged = token.hash ? false : true;

    $scope.loginAction = function(){
        $scope.loginError = '';
        REST.Login().get({email: $scope.authEmail, password: $scope.authPassword}, function(ret) {
            if(ret.status == 'ok'){
                Auth.put(ret.data.token);
                $location.path('portfolio');
                $rootScope.notLogged = false;
            }
            else{
                $scope.loginError = ret.error;
            }
        });
    }

    $scope.logoutAction = function(){
        $rootScope.notLogged = true;
        Auth.logout();
        $location.path('home');
    }


}]);

//Portfolio controller - list companies
swissCntls.controller('portfolioController', ['$scope', '$location', 'REST', function($scope, $location, REST) {

    $scope.companies = [];
    $scope.portfolios = [];
    $scope.select = {selected: null};  

    loadPortfolio = function(choosenPortfolio){
        $scope.loading = true;
        REST.Portfolio().get({portfolioId: choosenPortfolio}, function(ret) {
            if(ret.status == 'ok'){
                $scope.companies = ret.companies;
                $scope.portfolios = ret.portfolios;
                $scope.select = {selected: ret.companies[0]['portfolio_id']};
                $scope.loading = false;
            }
            else{
                if(ret.logged == 'fail'){
                    $location.path('home');
                }
            }
        });
    }

    //load another portfolio
    $scope.changePortfolio = function(portfolioId){
        loadPortfolio(portfolioId);
    }
    
    //load default portfolio on start
    loadPortfolio(null);

}]);

//Notes controller - read notes
swissCntls.controller('notesReadController', ['$scope', '$location', '$routeParams', 'REST', function($scope, $location, $routeParams, REST) {

    $scope.notes = [];
    $scope.loading = true;    

    REST.Notes().get({companyId: $routeParams.companyId, companyKind: $routeParams.companyKind}, function(ret) {
        if(ret.status == 'ok'){
            $scope.notes = ret.notes;
            $scope.loading = false;
        }
        else{
            if(ret.logged == 'fail'){
                $location.path('home');
            }
        }
    });
    
    //format date to Unix time
    $scope.unixDate = function(dateStr){
        var dStr = dateStr.split(' ');
        var hStr = dStr[1].split(':');
        d = new Date(dStr[0]);
        d.setHours(hStr[0]);
        d.setMinutes(hStr[1]);
        return d.getTime();
    }

}]);