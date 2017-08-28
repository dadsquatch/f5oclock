angular.module('myApp', [])
  .controller('myCtrl', ['$scope','$interval', '$http', function($scope, $interval, $http) {

    $scope.message = firstFetch();

    // Loop for fetching information from API routes
    $interval(function() {
      console.log('Running');
      $http.get('/getPosts').then(function(response){
        $scope.message = response.data;
      })
    }, 10000);

    function firstFetch(){
      var testData = 'This should be the first fetch';
      return testData
    }

  }])
