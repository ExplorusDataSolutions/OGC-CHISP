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
		this.originStyle = L.Util.extend({}, this.originStyle, style);
		if (data.status == 'pending') {
			L.CircleMarker.prototype.initialize.call(this, latlng, this.pendingStyle);
		} else {
			L.CircleMarker.prototype.initialize.call(this, latlng, this.originStyle);
		}
	},
	setOpacity : function() {
	},
	setZIndexOffset : function() {
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

		this.setStatus('pending');
	},
	isFromWFS : function() {
		return this.data && this.data.id;
	},
	isPending : function() {
		return this.data && this.data.status == 'pending';
	},
	setStatus : function(status) {
		if (status == 'pending') {
			this.setStyle(this.pendingStyle);
		} else if (status == 'origin') {
			this.setStyle(this.originStyle);
		}
	},
	subscribe : function(data, callback) {
		var latlng = this.getLatLng();

		/**
		 * @see https://github.com/tesera/OGC-CHISP/wiki/GIS-FCU-Subscription-Broker-API
		 */
		// var url = "http://140.134.48.13/WNS/Broker/RegisterInfo.ashx?op=subscribe"
		// A temporary substitution
		var url = location.origin + "/GIS-SFU-subscribe"
		data = data || {};
		data.id = this.data.poi_id || 0;
		data.status = this.data.status || 'pending';
		data.lat = latlng.lat.toFixed(8);
		data.lng = latlng.lng.toFixed(8);

		var me = this;
		$.ajax({
			url : '/proxy',
			data : {
				url : url,
				data : data,
				format : 'json',
			},
			dataType : 'json',
			success : function(json) {
				json.data.poi_id && (me.data = json.data);
				typeof callback == 'function' && callback(json);
			},
			error : function(xhr, status, e) {
				typeof callback == 'function' && callback({
					error : status + ' : ' + e
				});
			},
		});
	},
	cancelSubscribe : function(email, callback) {
		var data = this.data;
		if (!data.poi_id || data.poi_id == 0) {
			this.setStatus('origin');
			typeof callback == 'function' && callback({});
			return;
		}

		var url = location.origin + "/GIS-SFU-cancel-subscribe"
		var me = this;

		$.ajax({
			url : '/proxy',
			data : {
				url : url,
				data : {
					id : data.poi_id,
					email : email,
				},
			},
			dataType : 'json',
			success : function(json) {
				if (json.success) {
					me._map.removeLayer(me);
				}

				typeof callback == 'function' && callback(json);
			},
			error : function(xhr, textStatus, e) {
				typeof callback == 'function' && callback({
					error : textStatus || e
				});
			},
		});
	}
});
