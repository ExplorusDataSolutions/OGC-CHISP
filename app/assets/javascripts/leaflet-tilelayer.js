/**
 * Customized L.TileLayer to support status check
 */
var TileLayer = L.TileLayer.extend({
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
		L.TileLayer.prototype.initialize.apply(this, arguments);

		this.on('loading', this._onStatusLoading, this);
		this.on('load', this._onStatusLoad, this);
	},
});
