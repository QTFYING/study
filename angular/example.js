angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('CarouselDemoCtrl', function ($scope) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  $scope.slides = [
    [
      { title: 'A1', image: 'https://unsplash.it/600/300' },
      { title: 'A2', image: 'https://unsplash.it/600/300' },
      { title: 'A3', image: 'https://unsplash.it/600/300' }
    ],
    [
      { title: 'B1', image: 'https://unsplash.it/600/300' },
      { title: 'B2', image: 'https://unsplash.it/600/300' },
      { title: 'B3', image: 'https://unsplash.it/600/300' }
    ]
  ];
});