/**
 * Customized L.MarkerClusterGroup
 */
var MarkerGroup = L.LayerGroup.extend({
	includes : [L.Mixin.Events],

	options : {
		style : {},
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

	/**
	 * Support status check
	 */
	_status : 'off',

	status : function() {
		return this._status;
	},

	_onStatusLoading : function() {
		this._status = 'loading';
	},

	_onStatusLoad : function() {
		this._status = 'on';
	},

	initialize : function(options) {
		L.LayerGroup.prototype.initialize.apply(this);

		if (options.showMessage) {
			this.showMessage = options.showMessage;
			delete options.showMessage;
		}

		L.Util.setOptions(this, options);
		this.on('loading', this._onStatusLoading, this);
		this.on('load', this._onStatusLoad, this);
	},

	showMessage : function(msg, status) {
		alert(status + ' : ' + msg);
	},

	load : function() {
		var me = this, options = me.options;
		if (options.url && options.email) {
			me.clearLayers();
			me.fire('loading');

			var url = options.url + '&email=' + options.email;
			$.ajax({
				url : '/proxy',
				data : {
					url : url,
				},
				dataType : 'json',
				success : function(json) {
					if (json.code == 'UserNotFound') {
						me.showMessage(json.message, 'error');
					}
					var marker, point, data;
					for (var i = 0, row; row = json[i]; i++) {
						if (row.poiType == 'S') {
							continue;
						}
						point = [row.lat, row.lng];
						data = {
							poi_id : row.poiID,
							type : row.poi_type,
							status : row.status,
						}
						marker = new CircleMarker(point, data, options.style);
						me.addLayer(marker);
						me.options.onMarkerAdded && me.options.onMarkerAdded(marker)
					}

					me.fire('load');
				},
				error : function(xhr, status, e) {
					me.showMessage(status + ' : ' + e, 'error');
				}
			});
		}
	},

	//Overrides L.MarkerClusterGroup.onAdd
	onAdd : function(map) {
		map._initPathRoot();

		this.options.click && map.on('click', this.options.click, this);
		this.options.onEmailLogin && this.options.onEmailLogin.call(this);

		L.DomEvent.on(map._pathRoot, 'click', this._onMouseClick, this);
		L.DomEvent.on(map._pathRoot, 'mouseover', this._onMouseOver, this);
		L.DomEvent.on(map._pathRoot, 'mouseout', this._onMouseOut, this);

		L.LayerGroup.prototype.onAdd.apply(this, arguments);

		this.load();
	},

	_onMouseClick : function(e) {
		if (e.target.tagName == 'svg') {
			// click on map, to bubble
		} else {
			L.DomEvent.stopPropagation(e);
		}
	},

	_onMouseOver : function(e) {
		if (e.target.tagName == 'path') {
			this._map.openPopup(e.target.id);
		}
	},

	_onMouseOut : function(e) {
		if (e.target.tagName == 'path') {
			this._map.closePopup(e.target.id);
		}
	},

	addLayer : function(layer) {
		layer.groupLayer = this;
		return L.LayerGroup.prototype.addLayer.apply(this, arguments);
	},

	removeLayer : function(layer) {
		delete layer.groupLayer;
		return L.LayerGroup.prototype.removeLayer.apply(this, arguments);
	},
});
