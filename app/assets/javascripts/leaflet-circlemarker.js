/**
 * Customize the circle style
 */
CircleMarker = L.CircleMarker.extend({
	data : {},
	originStyle : {
		radius : 5,
		weight : 2,
		color : '#ff0000',
		opacity : 1,
		fill : true,
		fillOpacity : 0.1,// For mouse easy to hover and click on
	},
	pendingStyle : {
		radius : 5,
		weight : 2,
		color : '#00ffff',
		opacity : 1,
		fill : true,
		fillColor : '#FAA732',
		fillOpacity : 1
	},
	initialize : function(latlng, data, style) {
		this.data = data || {};
		L.Util.extend(this.originStyle, style);
		L.CircleMarker.prototype.initialize.call(this, latlng, this.originStyle);
	},
	setOpacity : function() {
	},
	_initPath : function() {
		L.CircleMarker.prototype._initPath.apply(this, arguments);
		this._path.id = L.Util.stamp(this);
	},
	_onMouseClick : function(e) {
		if (this._map.dragging && this._map.dragging.moved()) {
			return;
		}

		this._fireMouseEvent(e);
		//Disable this to enable bubble
		//L.DomEvent.stopPropagation(e);

		if (this.isFromWFS()) {
			this.setStatus('pending');
		}
	},
	isFromWFS : function() {
		return this.data && this.data.id;
	},
	setStatus : function(status) {
		if (status == 'pending') {
			this.setStyle(this.pendingStyle);
		} else if (status == 'origin') {
			this.setStyle(this.originStyle);
		}
	},
	subscribe : function(callback) {
		var latlng = this.getLatLng();
		var data = {
			REQUEST : "GetFeatureInfo",
			EXCEPTIONS : "application/vnd.ogc.se_xml",
			BBOX : map.getBounds().toBBoxString(),
			SERVICE : "WMS",
			QUERY_LAYERS : 'w_level',
			Layers : 'w_level',
			VERSION : '1.1.1',
			SRS : 'EPSG:4326',
			WIDTH : map.getSize().x,
			HEIGHT : map.getSize().y,
			y : latlng.lat,
			x : latlng.lng,
		};
		var kvp = [];
		for (var key in data) {
			kvp.push(key + '=' + data[key]);
		}
		var url = cdnStreamFLow.getUrl() + '?' + kvp.join('&');

		$.ajax({
			url : '/proxy',
			data : {
				url : url
			},
			success : function(xml, status, response) {
				var $response = $(xml).find('GetFeatureOfInterestResponse');
				var markers = [];
				$response.find('featureMember').each(function(index, element) {
					var pos = $(element).find('pos')[0].textContent.split(' ');
					var description = $(element).find('description')[0].textContent;
					markers.push(new L.Marker(pos));
				})
				$.isFunction(callback) && callback(markers);
			}
		});
	}
});
