/**
 * Customized Layers Control
 */
LayersControl = L.Control.Layers.extend({
	_initLayout : function() {
		L.Control.Layers.prototype._initLayout.apply(this, arguments);

		this._form.style.marginBottom = '0px';
	},
	/**
	 * Support display layer status
	 */
	_addItem : function(obj) {
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		if (container.childNodes.length == 0) {
			container.innerHTML = '<table width="100%"></table>';
		}
		var tb = container.childNodes[0];

		var label = document.createElement('label'), input, checked = this._map.hasLayer(obj.layer);
		label.style.fontSize = '12px';
		label.style.marginBottom = '0px';
		label.style.padding = '0 10px 0 5px';
		if (obj.layer.options.style) {
			label.style.color = obj.layer.options.style.color;
		}
		label.innerHTML = obj.name;

		if (obj.overlay) {
			label.className = 'checkbox';
			input = document.createElement('input');
			input.type = 'checkbox';
			input.defaultChecked = checked;
		} else {
			label.className = 'radio';
			input = this._createRadioElement('leaflet-base-layers', checked);
		}
		input.style.marginTop = '0px';
		input.style.top = '0px';
		input.layerId = L.Util.stamp(obj.layer);
		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var status = document.createElement('div');
		status.className = 'layer-status layer-status-' + obj.layer.status();
		if (status.className == 'layer-status layer-status-loading') {
			status.blinkTimer = setInterval(function() {
				status.style.opacity = Math.sin((new Date).getTime() / 150);
			}, 100);
		}
		obj.layer.on('loading', function() {
			status.className = 'layer-status layer-status-loading';
			status.blinkTimer && clearInterval(status.blinkTimer);
			status.blinkTimer = setInterval(function() {
				status.style.opacity = Math.sin((new Date).getTime() / 100);
			}, 100);
		});
		obj.layer.on('load', function() {
			status.className = 'layer-status layer-status-on';
			status.style.opacity = 1;
			clearInterval(status.blinkTimer);
			status.blinkTimer = null;
		});
		obj.layer.on('hide', function() {
			status.className = 'layer-status layer-status-off';
			status.style.opacity = 1;
			clearInterval(status.blinkTimer);
			status.blinkTimer = null;
		});

		var tr = tb.insertRow(-1);
		tr.insertCell(0).appendChild(status);
		tr.insertCell(1).appendChild(label);
		tr.insertCell(2).appendChild(input);
	},
});
