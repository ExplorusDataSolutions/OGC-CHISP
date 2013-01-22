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

		L.Util.setOptions(this, options);
		this.on('loading', this._onStatusLoading, this);
		this.on('load', this._onStatusLoad, this);

		this.load();
	},

	load : function() {
		var me = this;
		if (me.options.url) {
			me.fire('loading');

			var url = this.options.url;
			$.ajax({
				url : '/proxy',
				data : {
					url : url,
				},
				dataType : 'json',
				success : function(json) {
					var marker, point, data, options = me.options;

					for (var i = 0, row; row = json[i]; i++) {
						if (!row.lat) {
							continue;
						}
						point = [row.lat, row.lng];
						data = {
							poi_id : row.poi_id,
							type : row.poi_type,
							status : row.status,
							sw_flow_threshold : row.sw_flow_threshold,
							sw_level_threshold : row.sw_level_threshold,
							frequency : row.frequency,
						}
						marker = new CircleMarker(point, data, options.style);
						me.addLayer(marker);
						me.options.onMarkerAdded && me.options.onMarkerAdded(marker)
					}

					me.fire('load');
				},
				error : function(xhr, statusText) {
					alert(statusText)
				}
			});
		}
	},

	//Overrides L.MarkerClusterGroup.onAdd
	onAdd : function(map) {
		map._initPathRoot();

		this.options.click && map.on('click', this.options.click, this);

		L.DomEvent.on(map._pathRoot, 'click', this._onMouseClick, this);
		L.DomEvent.on(map._pathRoot, 'mouseover', this._onMouseOver, this);
		L.DomEvent.on(map._pathRoot, 'mouseout', this._onMouseOut, this);

		L.LayerGroup.prototype.onAdd.apply(this, arguments);
	},

	_onMouseClick : function(e) {
		if (e.target.tagName == 'svg') {
			// click on map, to bubble
		} else {
			var marker = this._map.getLayerById(e.target.id);
			this._map.fire('clickMarker', {
				marker : marker
			});
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
});
