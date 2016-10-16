

// Define the `thingsApp` module
var thingsApp = angular.module('thingsApp', []);


// Define the `ThingListController` controller on the `thingsApp` module
thingsApp.controller('ThingListController', function ThingListController($scope, $http, $timeout) {


 
  // View and Model communicate through $scope attributes, for instance $scope.phones
  $scope.title = "My things app";  // jne
  $scope.thingData = '';

  //$scope.PostDataResponse = "Actions";
  // $scope.formData = {
        
  //       name: formData.name,
  //       type: formData.type,
  //       latitude: formData.latitude,
  //       longitude: formData.longitude,
  //       active: formData.active
        
  //   };

  $http.get("api/things")
    .then(function(response) {
        $scope.things = response.data;
    });




  $scope.SendData = function (formData) {

    var dataObj = {
        name : $scope.formData.name,
        type : $scope.formData.type,
        latitude : $scope.formData.latitude,
        longitude : $scope.formData.longitude,
        active : $scope.formData.active,
        battery: $scope.formData.battery
    };  

    $scope.PostDataResponse = dataObj;
    
     var res = $http.post('api/things', dataObj);
    res.success(function(data, status, headers, config) {
      $scope.PostDataResponse = "Thing added!";
    });
    res.error(function(data, status, headers, config) {
      alert( "failure message: " + JSON.stringify({data: data}));
    });   
       
    

 };

 $scope.activate = function (athing) {
            
           
           
              athing.active = "true";

              $scope.PostDataResponse = "Thing status Changed!" + JSON.stringify(athing);

              

            
            var thing_id = athing._id;
            
            var res = $http.put("api/things/" + thing_id, athing);
            res.success(function(data, status, headers, config) {
      $scope.PostDataResponse = "Thing status Changed!";
    });
            

        };

  $scope.deactivate = function (athing) {
            
           
           
              athing.active = "false";

              $scope.PostDataResponse = "Thing status Changed!" + JSON.stringify(athing);

              

            
            var thing_id = athing._id;
            
            var res = $http.put("api/things/" + thing_id, athing);
            res.success(function(data, status, headers, config) {
      $scope.PostDataResponse = "Thing status Changed!";
    });
            

        };







            
 
  $scope.delete = function (athing) {

    var thing_id = athing._id;
    $http.delete("api/things/" + thing_id);

    //refresh scope
    $http.get("api/things")

      .then(function(response) {
      $scope.things = response.data;
      $scope.$apply(function(){
        $scope.message = "done deleting";});
        //$scope.things = response.data;
        //$scope.$apply();
        //reload page
        //$http.get("/");

    });
  }

  updateMarkers = function(){


        for (var i=0; i<$scope.markers.length; i++) {

        $scope.markers[i].setMap(null);
        $scope.markers[i].close();
        
    }
        //var infowindow;
        $scope.markers.length = 0;

        for (var i = 0; i < $scope.things.length; i++ ) {
        
        var thing = $scope.things[i];


        var coordinatesLat = parseFloat(thing.latitude);
        var coordinatesLong = parseFloat(thing.longitude);
        var itemLocation = new google.maps.LatLng(coordinatesLat, coordinatesLong);

        
        var infowindow = new google.maps.InfoWindow({
            position: itemLocation,
            map: $scope.map,
            content: thing.name,
            disableAutoPan: true
          });
        $scope.markers[i] = infowindow;


        //var infowindow = $scope.markers[i];
        //map: map,
        //infowindow.position = itemLocation;
        //content: thing.name,
        //infowindow.disableAutoPan = true;
        


        //infowindow.open(map);
        //infowindow.close();
        //$scope.markers[i] = infowindow;

}
      
      //$scope.markers = [];
      for (var i=0; i<$scope.markers.length; i++) {
        $scope.markers[i].setMap(null);
        $scope.markers[i].close();
        $scope.markers[i].open(map);
    }
      
      //$scope.updatedMarkers = markers;
}



  
  //timeout loop
  $scope.timeInS = 0;

    var countUp = function () {
      $scope.message = "done deleting";
        $scope.timeInS += 1;
        $timeout(countUp, 3000);
        $scope.message = "Timeout called!";
        
        //refresh scope
      $http.get("api/things")

      .then(function(response) {
      $scope.things = response.data;
      updateMarkers();
      $scope.message = "Updated things!";
      // $scope.$apply(function () {
            
      //     });
        //$scope.things = response.data;
        //$scope.$apply();
        //reload page
        //$http.get("/");

    });

    }
    $timeout(countUp, 1000);


  
  $scope.markers = [];


  $scope.initMarkers = function() {

    //The function $new is creating a new scope inheriting the 
    //variables from the parent. true prevents the inheritance.
    //$scope.markers = $scope.$new(true);

    if ($scope.things != undefined) {
        for (var i = 0; i < $scope.things.length; i++ ) {
        var thing = $scope.things[i];

        //convert location strings


        //var commaPos = thing.location[i].indexOf(',');
        var coordinatesLat = parseFloat(thing.latitude);
        var coordinatesLong = parseFloat(thing.longitude);
        var itemLocation = new google.maps.LatLng(coordinatesLat, coordinatesLong);

        //latlng = new google.maps.LatLng(thing.location);
        // clear marker array
        
        
        $scope.markers.push(
          
          new google.maps.InfoWindow({
            position: itemLocation,
            map: $scope.map,
            content: thing.name,
            disableAutoPan: true


          //new google.maps.Marker({
          //  position: itemLocation,
          //  map: $scope.map,
          //  title: thing.name


          })
        );
      };

    } else {
      setTimeout(function() { $scope.initMarkers(); }, 250);
    }
  }
  
});


// Init google maps
// bind to main window window (body id=MainWrap)
var map;
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 62.596, lng: 29.777},
    zoom: 8,

    styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]

  });
  
  angular.element(document.getElementById('MainWrap')).scope().map = map;
  
  //angular.element(document.getElementById('MainWrap')).scope().initMarkers();

};


