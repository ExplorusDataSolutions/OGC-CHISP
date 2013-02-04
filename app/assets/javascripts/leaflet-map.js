/**
 * Customized L.Map
 */
var Map = L.Map.extend({
	_initEvents : function() {
		L.Map.prototype._initEvents.apply(this, arguments);

		// Method this._initPathRoot() need Map._resetView() called, so on('load') is neccessary
		this.on('load', this.onLoad, this);
	},
	onLoad : function() {
		this._initPathRoot();

		L.DomEvent.on(this._pathRoot, 'mouseover', this.showMarkerPopup, this);
		L.DomEvent.on(this._pathRoot, 'mouseout', this.hideMarkerPopup, this);
	},
	showMarkerPopup : function(e) {
		if (e.target.tagName == 'path') {
			var markerId = e.target.id;
			var marker = this.getLayerById(markerId);
			if (marker) {
				this.openMarkerPopup(marker);
				this.options.onMarkerHover && this.options.onMarkerHover(marker, true);
			}
		}
	},
	hideMarkerPopup : function(e) {
		if (e.target.tagName == 'path') {
			var markerId = e.target.id;
			var marker = this.getLayerById(markerId);
			if (marker) {
				this.closeMarkerPopup(marker);
				this.options.onMarkerHover && this.options.onMarkerHover(marker, false);
			}
		}
	},
	openMarkerPopup : function(marker) {
		var markerID = L.Util.stamp(marker);

		var latlng = marker.getLatLng();
		var rows = [];
		for (var key in marker.data) {
			rows.push(key + ' : ' + marker.data[key]);
		}
		var content = rows.join('<br />');

		this._popup || (this._popup = new L.Popup({
			markerID : markerID,
			offset : new L.Point(0, -3),
		}));
		this._popup.setLatLng(latlng).setContent(content);
		L.Map.prototype.openPopup.call(this, this._popup);
	},
	closeMarkerPopup : function(marker) {
		var markerID = L.Util.stamp(marker);

		if (this._popup && this._popup.options.markerID == markerID) {
			return this.closePopup();
		} else {
			return this;
		}
	},
	/**
	 * This is to remove the zoom level limit of the whole map,
	 *  which is caused by the zoom level limit of a overlay layer,
	 *  whose minZoom or maxZoom options have 0 ~ 18 values
	 */
	_limitZoom : function(zoom) {
		return zoom;
	},
	getLayerById : function(id) {
		return this._layers[id] || null;
	},
	removeLayerById : function(id) {
		return this.removeLayer(this._layers[id]);
	},
	reproject : function(crs, point, zoom, unbounded) {
		crs = ( typeof crs === 'undefined' ? this.options.crs : crs);
		return crs.project(this.unproject(point, zoom, unbounded));
	},
});
