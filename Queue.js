angular.module('Queue',['ngRoute', 'firebase'])

.value('fbURL', 'https://xmqueue.firebaseio.com/')

.factory('Queues', function($firebase, fbURL) {
    return $firebase(new Firebase(fbURL));
})

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller:'ListCtrl',
            templateUrl:'list.html'
        })
        .when('/detail/:queueId', {
            controller:'DetailCtrl',
            templateUrl:'detail.html'
        })
        .when('/new', {
            controller:'CreateCtrl',
            templateUrl:'create.html'
        })
        .otherwise({
            redirectTo:'/'
        });
})

.controller('ListCtrl', function($scope, $location, Queues) {
    $scope.queues = Queues;
    $scope.getDate = function(date){
        var res = '';
        date = new Date(date);
        res += (date.getDate()<10? '0' : '') + date.getDate() + '.';
        res += (date.getMonth()+1<10? '0' : '') + (date.getMonth()+1) + '.';
        res += date.getFullYear();
        return res;
    };
    $scope.searcher = function(a){
        $scope.search = {};
        $scope.search.subject = a;
    };
    $scope.goto = function(a){
        $location.path('/detail/' + a);
    }
})

.controller('CreateCtrl', function($scope, $location, $timeout, Queues) {

    $scope.queue = {
        date: new Date(),
        items:[]
    };


    $scope.save = function() {
        $scope.queue.date = new Date($scope.queue.date).getTime();
        $scope.queue.create = new Date().getTime();
        Queues.$add($scope.queue, function(data) {
            console.log(arguments)
            $timeout(function() { $location.path('/'); });
        });
    };
})

.controller('DetailCtrl', function($scope, $location, $routeParams, $firebase, fbURL) {
    var queueUrl = fbURL + $routeParams.queueId;
    $scope.queue = $firebase(new Firebase(queueUrl));

    $scope.cons = function(a){
        console.log(a);
        window.a = a;
    }

    $scope.searcher = function(a){
        $scope.search = {};
        $scope.search.name = a;
    };

    $scope.addItem = function() {
        if(!$scope.queue.items){
            $scope.queue.items = [];
        }
        $scope.queue.items.push({name:$scope.name,done:false,create:new Date().getTime()});
        $scope.queue.$save();
        $scope.name = '';
    };
});
