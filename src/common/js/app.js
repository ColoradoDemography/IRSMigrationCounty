// @flow


var p: Promise = new Promise(function(resolve) {

    /* $FlowIssue - Flow throws cannot find module error on Worker */
    var Worker = require("worker!./workers/load_data.js");
    var worker: Worker = new Worker;

    worker.postMessage("start");
    worker.onmessage = function(e) {
        resolve(e.data);
    }

});

document.addEventListener("DOMContentLoaded", function() {
    'use strict';

    require("!style!css!../../lib/css/leaflet.modal.css");
    require("!style!css!../../lib/css/leaflet.label.css");
    require("!style!css!../css/app.css");


    var basemaps = require("./load_basemaps")();

    var map = L.map('map', {
        center: [39, -105.5],
        zoom: 7,
        layers: [basemaps.nolabel],
        zoomControl: false
    });

    require("./add_legend")(map);

    var layer = require("./geojson_layers.js")(map);

    require("./add_credits")(map);
    require("./add_title_control")(map);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    require("./add_layer_control.js")(map, basemaps);


    p.then(function(worker_data) {
        require("./add_custom_control.js")(map, layer, worker_data);
    }, function(fail_reason) {
        console.log(fail_reason);
    });




}); //end DOM Content Loaded