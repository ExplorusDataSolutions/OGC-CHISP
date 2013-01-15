/**
 * Customized L.Map
 */
var Map = L.Map.extend({
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
	openPopup : function(markerId) {
		var marker = this.getLayerById(markerId);
		if (!marker)
			return;
		var latlng = marker.getLatLng();
		var rows = ["Point #" + markerId];
		for (var key in marker.data) {
			rows.push(key + ' : ' + marker.data[key]);
		}
		var content = rows.join('<br />');

		this._popup || (this._popup = new L.Popup({
			markerId : markerId,
			offset : new L.Point(0, -3),
		}));
		this._popup.setLatLng(latlng).setContent(content);
		L.Map.prototype.openPopup.call(this, this._popup);
	},
	closePopup : function(markerId) {
		if (markerId) {
			if (this._popup && this._popup.options.markerId == markerId) {
				return this.closePopup();
			} else {
				return this;
			}
		} else {
			return L.Map.prototype.closePopup.call(this);
		}
	},
	reproject : function(crs, point, zoom, unbounded) {
		crs = ( typeof crs === 'undefined' ? this.options.crs : crs);
		return crs.project(this.unproject(point, zoom, unbounded));
	},
});
