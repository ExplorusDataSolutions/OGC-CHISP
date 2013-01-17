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
		var label = document.createElement('label'), input, checked = this._map.hasLayer(obj.layer);
		label.style.fontSize = '12px';
		label.style.whiteSpace = 'nowrap';
		label.style.marginBottom = '0px';
		label.style.paddingLeft = '0px';

		if (obj.overlay) {
			label.className = 'checkbox';
			input = document.createElement('input');
			input.type = 'checkbox';
			input.defaultChecked = checked;
		} else {
			label.className = 'radio';
			input = this._createRadioElement('leaflet-base-layers', checked);
		}
		input.style.cssFloat = 'right';
		input.style.marginLeft = '0px';

		input.layerId = L.Util.stamp(obj.layer);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = obj.name + " &#160;";
		if (obj.layer.options.style) {
			name.style.color = obj.layer.options.style.color;
		}

		var status = document.createElement('span');
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

		label.appendChild(input);
		label.appendChild(name);

		var tb = document.createElement('table');
		tb.style.width = '100%';
		var tr = tb.insertRow(0);
		tr.insertCell(0).appendChild(status);
		tr.insertCell(1).appendChild(label);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(tb);
	},
});
