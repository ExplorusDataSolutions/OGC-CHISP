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
		if (this.isPending(data.status)) {
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

		this.setPendingStatus();
	},
	isFromWFS : function() {
		return this.data && this.data.id;
	},
	isPending : function(status) {
		return status == 'Pending' || this.data && this.data.status == 'Pending';
	},
	setPendingStatus : function() {
		this.setStatus('Pending');
	},
	setStatus : function(status) {
		this.data.status = status;
		if (this.isPending(status)) {
			this.setStyle(this.pendingStyle);
		} else if (status == 'origin') {
			this.setStyle(this.originStyle);
		}
	},
});
