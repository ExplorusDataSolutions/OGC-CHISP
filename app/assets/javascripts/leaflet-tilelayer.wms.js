/**
 * Enable specified EPSG:4326 for single layer
 */
var WMS = L.TileLayer.WMS.extend({
	_status : 'off', // off, loading, on

	status : function() {
		return this._status;
	},

	_onStatusLoading : function() {
		this._status = 'loading';
	},

	_onStatusLoad : function() {
		this._status = 'on';
	},

	initialize : function(url, options) {
		L.TileLayer.WMS.prototype.initialize.apply(this, arguments);

		this.on('loading', this._onStatusLoading, this);
		this.on('load', this._onStatusLoad, this);
	},

	getUrl : function() {
		return this._url;
	},

	onAdd : function(map) {
		var crs = this.options.crs || map.options.crs;
		delete this.wmsParams.crs;

		var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = crs.code;

		L.TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl : function(tilePoint, zoom) {// (Point, Number) -> String
		var map = this._map, //
		crs = this.options.crs, //
		tileSize = this.options.tileSize, //
		nwPoint = tilePoint.multiplyBy(tileSize), //
		sePoint = nwPoint.add(new L.Point(tileSize, tileSize)), //
		nw = map.reproject(crs, nwPoint, zoom, true), //
		se = map.reproject(crs, sePoint, zoom, true), //
		bbox = [nw.x, se.y, se.x, nw.y].join(','), //
		url = L.Util.template(this._url, {
			s : this._getSubdomain(tilePoint)
		});

		return url + L.Util.getParamString(this.wmsParams) + "&bbox=" + bbox;
	},

	_update : function(e) {
		if (this._map._panTransition && this._map._panTransition._inProgress) {
			return;
		}

		var zoom = this._map.getZoom();
		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
			this._status = 'off';
			this.fire('hide');
		}

		return L.TileLayer.WMS.prototype._update.apply(this, arguments);
	},
});
