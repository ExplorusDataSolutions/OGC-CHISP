/**
 * Customized L.MarkerClusterGroup
 */
var MarkerClusterGroup = L.MarkerClusterGroup.extend({
	includes : [L.Mixin.Events],

	options : {
		style : {},
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
		options.onLoad && this.on('load', options.onLoad, this);

		this.load();
	},

	addLayer : function(layer) {
		layer.groupLayer = this;
		return L.MarkerClusterGroup.prototype.addLayer.apply(this, arguments);
	},

	load : function() {
		var me = this;
		if (me.options.url) {
			me.fire('loading');

			var url = this.options.url;
			var xml = this.options.xml;
			var bounds = this.options.bounds;
			if (url) {
				url = url.replace('{bBoxString}', bounds.toBBoxString());
			}
			if (xml) {
				xml = xml.replace(//
				/<gml:lowerCorner>.*?<\/gml:lowerCorner>/, //
				'<gml:lowerCorner>' + bounds.getSouthWest().lng + ' ' + bounds.getSouthWest().lat + '</gml:lowerCorner>'//
				).replace(//
				/<gml:upperCorner>.*?<\/gml:upperCorner>/, //
				'<gml:upperCorner>' + bounds.getNorthEast().lng + ' ' + bounds.getNorthEast().lat + '</gml:upperCorner>'//
				);
			}

			$.ajax({
				url : '/proxy',
				data : {
					url : url,
					xml : xml,
				},
				dataType : 'xml',
				success : function(xml) {
					var point, data, name, value, options = me.options;

					$(xml).find(options.elementTag).each(function(index, element) {
						point = $(element).find(options.positionTag).text().split(' ');
						data = options.data(element);
						me.addLayer(new CircleMarker(point, data, options.style));
					});

					me.fire('load');
				}
			});
		}
	},

	_update : function(bounds) {
		this.clearLayers();

		this.options.bounds = bounds;
		this.load();
	},

	/**
	 * Customize the cluster marker
	 */
	_defaultIconCreateFunction : function(cluster) {
		var childCount = cluster.getChildCount();

		return new MarkerClusterGroup.Icon({
			html : childCount,
			className : 'marker-cluster',
			iconSize : new L.Point(12, 12),
			color : cluster._group.options.style.color,
		});
	},
});

MarkerClusterGroup.Icon = L.DivIcon.extend({
	createIcon : function() {
		var div = L.DivIcon.prototype.createIcon.apply(this, arguments);

		div.style.border = '2px solid ' + this.options.color;

		return div;
	},
});
