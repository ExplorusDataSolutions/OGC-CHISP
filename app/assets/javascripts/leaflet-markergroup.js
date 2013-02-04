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

	stationPoints : [],
	load : function() {
		var me = this, options = me.options;

		if (options.url && options.email) {
			me.fire('loading');

			var url = options.url + '&email=' + options.email;
			$.ajax({
				url : '/proxy',
				data : {
					url : url,
				},
				cache : false,
				dataType : 'json',
				success : function(json) {
					if (json.code == 'UserNotFound') {
						me.showMessage(json.message, 'error');
					}
					me.stationPoints = [];
					for (var i = 0, data; data = json[i++]; ) {
						if (data.poiType == 'S') {
							me.stationPoints.push(data);
							options.onSoiLoad && options.onSoiLoad(data);
						} else if (data.poiType == 'P') {
							marker = new CircleMarker([data.lat, data.lng], data, options.style);
							me.addLayer(marker);
							options.onPoiLoad && options.onPoiLoad(marker);
						}
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

		this.options.onClick && L.DomEvent.on(map._pathRoot, 'click', this._onMouseClick, this);
		this.options.onLoad && this.on('load', this.options.onLoad, this);
		this.options.onSubscribe && this.options.onSubscribe.call(this);
		this.options.onEmailLogin && this.options.onEmailLogin.call(this);
		this.options.onEmailLogout && this.options.onEmailLogout.call(this);

		L.LayerGroup.prototype.onAdd.apply(this, arguments);

		this.load();
	},

	_onMouseClick : function(e) {
		if (this._map.dragging && this._map.dragging.moved()) {
			return;
		}
		this.options.onClick.call(this, e);
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
