(function(){
    'use strict';

    angular
    .module('ngGoogleMap', [])
    .provider('$gmap', gmapProvider)
    .directive('bzGoogleMap', bzGoogleMap);

    function gmapProvider(){
        var config = {
            language: 'vi'
        };

        this.setLanguage = function(val) {
            config.language = val;
        };

        this.$get = function($q, $window) {
            var gmap = $q.defer();

            loadScript();

            $window.initGoogleMap = function () {
                gmap.resolve();
            };

            function loadScript() {
                if (document.getElementById('googleMapScript')) {return;}
                var script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&language='+config.language+'&callback=initGoogleMap';
                script.id = 'googleMapScript';
                document.body.appendChild(script);
            }

            return {
                ready: function(callback) {
                    gmap.promise.then(callback);
                }
            };
        };
    }

    function bzGoogleMap($window, $gmap) {
        return {
            scope: {
                mapData: '=',
                mapStyle: '='
            },
            link: function(scope, iElement, iAttrs) {
                var map, myInfoWinow, gLocation;

                scope.$on('destroy', function(){
                    angular.element($window).off('resize.gmap');
                });

                $gmap.ready(function() {
                    if (scope.mapData) {
                        initialize();
                    }
                });

                function infoWindow(marker, text, width) {
                    myInfoWinow.setOptions({
                        maxWidth: width || 250
                    });

                    if(text){
                        myInfoWinow.setContent(text);
                        myInfoWinow.open(map, marker);
                    }
                }

                function addMarker(lat, lng, icon, title) {
                    var myImage = new google.maps.MarkerImage(icon, new google.maps.Size(40, 37), new google.maps.Point(0, 0), new google.maps.Point(20, 19));
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat, lng),
                        map: map,
                        icon: icon || myImage,
                        title: title
                    });
                    return marker;
                }

                function initialize() {
                    gLocation = new google.maps.LatLng(scope.mapData[0].lat, scope.mapData[0].lng);

                    var mapOptions = {
                        zoom: parseInt(iAttrs.mapZoom) || 16,
                        center: gLocation,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: iAttrs.mapWheel == 'true',
                        styles: scope.mapStyle | [],
                        disableDefaultUI: iAttrs.mapUi === 'false'
                    };

                    map = new google.maps.Map(document.getElementById(iAttrs.id), mapOptions);

                    myInfoWinow = new google.maps.InfoWindow();

                    for (var i = 0; i < scope.mapData.length; i++) {
                        var marker = addMarker(scope.mapData[i].lat, scope.mapData[i].lng, scope.mapData[i].icon, scope.mapData[i].title);
                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                infoWindow(marker, scope.mapData[i].content);
                            };
                        })(marker, i));
                    }

                    angular.element($window).on('resize.gmap', function() {
                        map.setCenter(gLocation);
                    });
                }
            }
        };
    }
})();