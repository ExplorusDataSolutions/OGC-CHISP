/**
 * Customized L.Control.Draw
 */
Draw = L.Control.Draw.extend({
	options : {
		position : 'topleft',
		polyline : false,
		polygon : false,
		marker : false,
		circle : false,
		rectangle : {
			shapeOptions : {
				color : 'orange',
				weight : 1,
				clickable : false,
			}
		},
	},

	addTo : function(map) {
		L.Control.Draw.prototype.addTo.apply(this, arguments);

		var drawnItems = new L.LayerGroup();
		map.addLayer(drawnItems);

		map.on('draw:rectangle-created', function(e) {
			drawnItems.clearLayers();
			drawnItems.addLayer(e.rect);
			bounds = e.rect.getBounds();

			var layers = map._layers;
			for (var id in layers) {
				if (layers[id] instanceof MarkerClusterGroup) {
					layers[id]._update(bounds);
				}
			}
		});
	},
})