/**
 * Customized L.MarkerClusterGroup
 */
var MarkerClusterGroup = L.MarkerClusterGroup.extend({
	includes : [L.Mixin.Events],

	options : {
		maxClusterRadius : 50,
		elementTag : 'member',
		positionTag : 'pos',
		dataCallback : function() {
		},
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
		L.MarkerClusterGroup.prototype.initialize.apply(this, arguments);

		this.on('loading', this._onStatusLoading, this);
		this.on('load', this._onStatusLoad, this);

		var me = this;
		if (me.options.url) {
			me.fire('loading');

			$.ajax({
				url : '/proxy',
				data : {
					url : this.options.url,
				},
				dataType : 'xml',
				success : function(xml) {
					var point, data, name, value, options = me.options;

					$(xml).find(options.elementTag).each(function(index, element) {
						point = $(element).find(options.positionTag).text().split(' ');
						data = options.data(element);
						me.addLayer(new CircleMarker(point, data));
					});

					me.fire('load');
				}
			});
		}
	},

	/**
	 * Customize the cluster marker
	 */
	_defaultIconCreateFunction : function(cluster) {
		var childCount = cluster.getChildCount();

		var c = ' marker-cluster-';
		if (this.type == 'Surface Water Station') {
			c += 'sw';
		} else if (this.type == 'Ground Water Station') {
			c += 'gw';
		} else {
			c += 'poi';
		}

		return new L.DivIcon({
			html : childCount,
			className : 'marker-cluster' + c,
			iconSize : new L.Point(12, 12)
		});
	},

	//Overrides L.MarkerClusterGroup.onAdd
	onAdd : function(map) {
		map._initPathRoot();

		L.DomEvent.on(map._pathRoot, 'click', this._onMouseClick, this);
		L.DomEvent.on(map._pathRoot, 'mouseover', this._onMouseOver, this);
		L.DomEvent.on(map._pathRoot, 'mouseout', this._onMouseOut, this);

		L.MarkerClusterGroup.prototype.onAdd.apply(this, arguments);
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

