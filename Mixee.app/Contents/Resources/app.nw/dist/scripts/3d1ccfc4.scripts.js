"use strict";
angular.module("peerflixServerApp", ["ngCookies", "ngResource", "ngSanitize", "ngRoute", "btford.socket-io", "angularFileUpload"]).config(["$routeProvider",
	function(a) {
		a.when("/", {
			templateUrl: "views/main.html",
			controller: "MainCtrl"
		}).otherwise({
			redirectTo: "/"
		})
	}
]).run(function() {
	window.addEventListener("dragover", function(a) {
		a.preventDefault()
	}, !1), window.addEventListener("drop", function(a) {
		a.preventDefault()
	}, !1)
}), angular.module("peerflixServerApp").controller("MainCtrl", ["$scope", "$resource", "$log", "$q", "$upload", "torrentSocket",
	function(a, b, c, d, e, f) {
		function g() {
			var b = j.query(function() {
				a.torrents = b.reverse()
			})
		}

		function h(b) {
			return j.get({
				infoHash: b
			}).$promise.then(function(c) {
				var d = _.find(a.torrents, {
					infoHash: b
				});
				if(window.playVideo){
					window.playVideo(b);
				}
				if (d) {
					a.torrents[e] = c
				} else a.torrents.unshift(c);
				return c
			})
		}

		function i(b) {
			var c = _.find(a.torrents, {
				infoHash: b
			});
			return c ? d.when(c) : h(b)
		}
		var j = b("/torrents/:infoHash");
		g(), a.keypress = function(b) {
			13 === b.which && a.download()
		}, a.download = function() {
			window.magnet && (j.save({
				link: window.magnet
			}).$promise.then(function(a) {
				h(a.infoHash)
			}), a.link = "")
		}, a.upload = function(a) {
			a && a.length && a.forEach(function(a) {
				e.upload({
					url: "/upload",
					file: a
				}).then(function(a) {
					h(a.data.infoHash)
				})
			})
		}, a.pause = function(a) {
			f.emit(a.stats.paused ? "resume" : "pause", a.infoHash)
		}, a.select = function(a, b) {
			f.emit(b.selected ? "deselect" : "select", a.infoHash, a.files.indexOf(b))
		}, a.remove = function(b) {
			j.remove({
				infoHash: b.infoHash
			}), _.remove(a.torrents, b)
		}, f.on("verifying", function(a) {
			i(a).then(function(a) {
				a.ready = !1
			})
		}), f.on("ready", function(a) {
			h(a)
		}), f.on("interested", function(a) {
			i(a).then(function(a) {
				a.interested = !0
			})
		}), f.on("uninterested", function(a) {
			i(a).then(function(a) {
				a.interested = !1
			})
		}), f.on("stats", function(a, b) {
			i(a).then(function(a) {
				a.stats = b
			})
		}), f.on("download", function(a, b) {
			i(a).then(function(a) {
				a.progress = b
			})
		}), f.on("selection", function(a, b) {
			
		}), f.on("destroyed", function(b) {
			_.remove(a.torrents, {
				infoHash: b
			})
		}), f.on("disconnect", function() {
			a.torrents = []
		}), f.on("connect", g)


		window.downloadStart=a.download;
	}
]), angular.module("peerflixServerApp").factory("torrentSocket", ["socketFactory",
	function(a) {
		return a()
	}
]);