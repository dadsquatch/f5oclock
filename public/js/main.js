angular.module('myApp', ['angularMoment','ngclipboard'])
  .controller('myCtrl', ['$scope','$interval', '$http', function($scope, $interval, $http) {

    $scope.message = firstFetch();
    $scope.date = Date.now();

    $scope.setBackgroundColor = function(value){
      if(value.upvoteCount >= 100 && value.upvoteCount < 250){
        return 'trending'
      } else if (value.upvoteCount >= 250 && value.upvoteCount < 500) {
        return 'hot'
      } else if (value.upvoteCount >= 500) {
        return 'f5oclock'
      } else {
        return
      }
    }

    // Loop for fetching information from API routes
    $interval(function() {
      $http.get('/getPosts').then(function(response){
        $scope.posts = response.data;
      })
    }, 5000);

    function firstFetch(){
      $http.get('/getPosts').then(function(response){
        $scope.posts = response.data;
      })
    }

  }])
  .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });
