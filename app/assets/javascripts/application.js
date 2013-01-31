// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require leaflet
//= require leaflet.config
//= require leaflet.markercluster-src
//= require leaflet.draw
//= require leaflet-map
//= require leaflet-circlemarker
//= require leaflet-tilelayer
//= require leaflet-tilelayer.wms
//= require leaflet-markergroup
//= require leaflet-clustermarker
//= require leaflet-layerscontrol
//= require leaflet-draw
//= require backbone-rails
//= require_self

jQuery(function($) {
	var appView = Backbone.View.extend({
		el : $('.navbar'),
		events : {
			"click button.btn-login" : "login",
			"click button.btn-logout" : "logout",
		},
		login : function(e) {
			var email = $('input[name=email]').val();
			if (!email) {
				return this.alert('Please input your email!', 'error')
			}
			app = this;
			$.ajax({
				url : '/login.json',
				type : 'post',
				data : {
					email : email,
				},
				dataType : 'json',
				success : function(json) {
					app.alert('Login success', 'success');
					app.loginEmail(email);
					app.trigger('login', email);
				},
				error : function(xhr, status, e) {
					app.alert('Login failed', 'error');
				},
			});
		},
		logout : function(e) {
			var app = this;

			$.ajax({
				url : '/logout.json',
				dataType : 'json',
				type : 'post',
				success : function(json) {
					app.alert('Logout success', 'success');
					$('.btn-login').parent().find('input').val('')
					$('.btn-login').parent().show();
					$('.btn-logout').parent().hide();
					app.trigger('logout');
				},
				error : function(xhr, status, e) {
					app.alert('Logout failed', 'error');
				},
			});
		},
		loginEmail : function(email) {
			$('.btn-login').parent().hide();
			$('.btn-login').parent().find('input').val(email)
			$('.btn-logout').parent().find('label').html(email)
			$('.btn-logout').parent().show();
		},
		alert : function(title, content, type) {
			if (!type) {
				type = content;
				content = '';
			}
			var html = '<h4>' + (title || '') + '</h4>' + (content || '');
			var cls = 'alert-' + (type || 'success');
			if ($('.alert-container').length == 0) {
				$('<div class="alert-container"></div>').appendTo($('body'));
			}
			$('<div class="alert ' + cls + ' hide"></div>')//
			.appendTo($('.alert-container'))//
			.html(html).show().fadeOut(5000, "linear", function() {
				$(this).remove();
			});
		},
	});
	$.app = new appView;
});
