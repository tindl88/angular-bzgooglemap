```javascript
angular
.module('myApp', ['ngGoogleMap'])
.config(config)
.controller('myCtrl', myCtrl);

function config($gmapProvider){
    $gmapProvider.setLanguage('vi');
}

function myCtrl($scope) {
	$scope.mapStyle = [{
		featureType: 'all',
		stylers: [{ saturation: -100 }]
	},{
		featureType: 'road.arterial',
		elementType: 'geometry',
		stylers: [{ hue: '#f4f4f4' },{ saturation: -100 }]
	},{
		featureType: 'poi.business',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }]
	}];

	$scope.mapData = [
		{icon: 'images/marker.png', lat: 12.239973, lng: 109.193432, title: 'title 1', content: ''},
		{icon: 'images/marker.png', lat: 12.239082, lng: 109.193507, title: 'title 2', content: 'content 2'}
	];
}
```

```html
<div ng-controller="myCtrl">
	<div bz-google-map id="gmap" map-wheel="false" map-zoom="15" map-ui="false" map-style="mapStyle" map-data="mapData" style="width:100%;height:500px"></div>
</div>
```
