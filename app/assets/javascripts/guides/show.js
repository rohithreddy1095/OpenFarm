openFarmApp.controller('showGuideCtrl', ['$scope', '$http', 'guideService',
    'userService', 'gardenService', 'cropService',
  function showGuideCtrl($scope,
                         $http,
                         guideService,
                         userService,
                         gardenService,
                         cropService) {
    $scope.guideId = getIDFromURL('guides') || GUIDE_ID;
    $scope.userId = USER_ID || undefined;
    $scope.gardenCrop = {};

    $scope.setGuideUser = function(success, object){
      if (success){
        console.log(object);
        $scope.guide.user = object;
      }
    };

    $scope.setCurrentUser = function(success, object){
      if (success){
        $scope.currentUser = object;

        $scope.currentUser.gardens.forEach(function(g){
          g.garden_crops.forEach(function(gc){
            if (gc.guide && gc.guide._id === $scope.guide._id){
              g.added = true;
              $scope.gardenCrop = gc;
            }
          });
        });
        if ($scope.guide.basic_needs){
          $scope.guide.basic_needs.forEach(function(b){
            if (b.percent < 0.5){
              switch (b.name){
                case 'Sun / Shade':
                  b.tooltip = 'Low compatibility with "' + b.garden +
                  '" because it gets ' + b.user;
                  break;
                case 'Location':
                  b.tooltip = 'Low compatibility with "' + b.garden +
                  '" because it is ' + b.user;
                  break;
                case 'Soil Type':
                  b.tooltip = 'Low compatibility with "' + b.garden +
                  '" because it has ' + b.user + ' soil';
                  break;
                case 'Practices':
                  b.tooltip = 'Low compatibility with "' + b.garden +
                  '" because you don\'t follow ' + b.user + ' practices there';
                  break;
              }
            }

            if (b.percent >= 0.5 && b.percent < 0.75){
              switch (b.name){
                case 'Sun / Shade':
                  b.tooltip = 'Medium compatibility with "' + b.garden +
                  '" because it gets ' + b.user;
                  break;
                case 'Location':
                  b.tooltip = 'Medium compatibility with "' + b.garden +
                  '" because it is ' + b.user;
                  break;
                case 'Soil Type':
                  b.tooltip = 'Medium compatibility with "' + b.garden +
                  '" because it has ' + b.user + ' soil';
                  break;
                case 'Practices':
                  b.tooltip = 'Medium compatibility with "' + b.garden +
                  '" because you follow ' + b.user +
                  ' and other practices there';
                  break;
              }
            }

            if (b.percent >= 0.75){
              switch (b.name){
                case 'Sun / Shade':
                  b.tooltip = 'High compatibility with "' + b.garden +
                  '" because it gets ' + b.user;
                  break;
                case 'Location':
                  b.tooltip = 'High compatibility with "' + b.garden +
                  '" because it is ' + b.user;
                  break;
                case 'Soil Type':
                  b.tooltip = 'High compatibility with "' + b.garden +
                  '" because it has ' + b.user + ' soil';
                  break;
                case 'Practices':
                  b.tooltip = 'High compatibility with "' + b.garden +
                  '" because you follow only ' + b.user + ' practices there';
                  break;
              }
            }
          });
        }
      }
    };

    $scope.setGuide = function(success, object){
      if (success){

        if ($scope.userId){
          userService.getUser($scope.userId,
                              $scope.setCurrentUser);
        }

        $scope.guide = object;
        userService.getUser($scope.guide.user.id,
                            $scope.setGuideUser);

        console.log($scope.guide);
        cropService.getCrop($scope.guide.relationships.crop.data.id,
                            function(success, crop) {
                              $scope.guide.crop = crop;
                            })

        $scope.haveTimes = $scope.guide.stages
          .sort(function(a, b){ return a.order > b.order; })
          .filter(function(s){ return s.stage_length; });

        $scope.plantLifetime = $scope.haveTimes.reduce(function(pV, cV){
          return pV + cV.stage_length;
        }, 0);
      }
    };

    guideService.getGuide($scope.guideId, $scope.setGuide);
  }]);
