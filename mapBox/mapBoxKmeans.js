/*jslint esnext:true*/

/*
https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
bbbMapData.loc.forEach(function(i,j) {
    console.log('{ "type": "Feature", "properties": { "name":"',i.name,'"}, "geometry": { "type": "Point", "coordinates": [ ',i.loc.lat,',',i.loc.lng,', 0.0 ] } },');
})
*/
bbbMap = {};
//let map;

bbbMap.initMap = function () {
    mapboxgl.accessToken = "pk.eyJ1IjoiZWxicmFuZGUiLCJhIjoiY2xoamp2MDF2MGlueTNjcDA2MDk3N2ltaiJ9.f0jAJ0Qc5Es8DmkVhEKY4Q";
    const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/light-v11",
        center: [-103.5917, 40.6699],
        zoom: 5,
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on("click", (e) => {
        console.log(`A click event has occurred at ${e.lngLat}`);
    });

    map.on("load", () => {
        console.log("Map Loaded");
    });

    // map = map;
    bbbMap.kmeansMap = new bbbMap.KMEANS(map, { $console: $("#bbbLogger"), data: bbbMapData });
};

bbbMap.KMEANS = function (map, opt) {
    console.log("creating kmeans object");
    this.opt = $.extend({}, this.defaults, opt);
    this.map = map;
    this._locationMarkers = [];
    this._loc = opt.loc;
    this._data = opt.data;
    this._clusterMarkers = [];
    this.logID = 0;
    this.infoWindow = null; //new google.maps.InfoWindow({'content': 'Info'});
    this.center = { lat: 39.990268, lng: -93.569075 };

    this.initKmeans();
};

bbbMap.KMEANS.prototype.defaults = {
    k: 75,
    n: 35,
    runInterval: 250,
    runLimit: 25,
    bermuda: { lat: 32.299507, lng: -64.79 },
    maxIntensity: 30,
    radius: 0.8,
    opacity: 0.5,
    clusterStyle: [
        { width: 20, height: 20, className: "custom-clustericon-1" },
        { width: 25, height: 25, className: "custom-clustericon-2" },
        { width: 30, height: 30, className: "custom-clustericon-3" },
    ],
    locationsLayerId: "kmeansLocations",
    clusterLayerId: "kmeansClusters",
};

bbbMap.KMEANS.prototype.log = function (txt) {
    this.logID++;

    if (this.opt.$console) {
        this.opt.$console.prepend(this.logID + ". " + txt + "<br>");
    } else {
        console.log(txt);
    }
};

bbbMap.KMEANS.prototype.getRandom = function (min, max) {
    let rtn = null;
    rtn = Math.random() * (max - min) + min;
    //console.log(min,max,'return', rtn);
    return rtn;
};

bbbMap.KMEANS.prototype.initKmeans = function () {
    console.log("Private kmeans init", this.opt);
    this.log("Initialized kmeans");
    document.querySelector("#k").value = this.opt.k;
};

bbbMap.KMEANS.prototype.setOption = function (n, v) {
    console.log("Setting option", n, v);
    if (v === undefined) {
        throw "please pass a valid value";
    }

    this.opt[n] = v;
};

bbbMap.KMEANS.prototype.start = function () {
    console.log("Starting kmeans", this.opt);
    this.log("Starting kmeans");

    this.dm_ = [];
    this.removeList = [];

    this.addLocations();

    this.removeClusters();
    this.seedClusters();
};

bbbMap.KMEANS.prototype.removeClusters = function () {
    console.log("Removing clusters");
    if (this._clusterMarkers) {
        this._clusterMarkers.forEach(function (c) {
            c.remove();
        });
    }

    //this.hideClusterBounds();
    this._clusterMarkers = [];
};

bbbMap.KMEANS.prototype.addLocations = function () {
    let that = this;
    console.log("Adding locations", this._data.features);
    if (this._locationMarkers.length > 0) {
        console.log("Markers already added");
    } else {
        this._locationMarkers = this._data.features.map(function (feature, i) {
            const el = document.createElement("div");
            el.className = "marker";
            el.style = "{'opacity': 0.6}";

            // make a marker for each feature and add to the map
            return new mapboxgl.Marker(el)
                .setLngLat(feature.geometry.coordinates)
                .setDraggable(true)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(`<h3>${feature.properties.name}</h3><p>Lat: ${feature.geometry.coordinates[1]}</p><p>Lng: ${feature.geometry.coordinates[0]}</p>`)
                )
                .addTo(that.map);
        });
    }
    /*
   for (const feature of this._data.features) {
     // create a HTML element for each feature
     const el = document.createElement('div');
     el.className = 'marker';
     el.style = "{'opacity': 0.6}";

     // make a marker for each feature and add to the map
     new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(this.map);
   }
   */
};

bbbMap.KMEANS.prototype.addLocations2 = function () {
    let that = this;

    if (this.map.getLayer(that.opt.locationsLayerId)) {
        null; //locations are already loaded
    } else {
        this.map.addSource(that.opt.locationsLayerId, {
            type: "geojson",
            data: bbbMapData,
            cluster: false,
            clusterMaxZoom: 14,
            clusterRadius: 50,
        });

        this.map.addLayer({
            id: "clusters",
            type: "circle",
            source: that.opt.locationsLayerId,
            filter: ["has", "point_count"],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
                "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
            },
        });

        this.map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: that.opt.locationsLayerId,
            filter: ["has", "point_count"],
            layout: {
                "text-field": ["get", "point_count_abbreviated"],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
            },
        });

        this.map.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: that.opt.locationsLayerId,
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-color": "#11b4da",
                "circle-radius": 4,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff",
            },
        });

        // inspect a cluster on click
        this.map.on("click", "clusters", (e) => {
            const features = that.map.queryRenderedFeatures(e.point, {
                layers: ["clusters"],
            });
            const clusterId = features[0].properties.cluster_id;
            that.map.getSource(that.opt.locationsLayerId).getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;

                that.map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom,
                });
            });
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        this.map.on("click", "unclustered-point", (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.name;
            //const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup().setLngLat(coordinates).setHTML(`Name: ${name}<br>test`).addTo(bbbMap.kmeansMap.map);
        });

        this.map.on("mouseenter", "clusters", () => {
            that.map.getCanvas().style.cursor = "pointer";
        });
        this.map.on("mouseleave", "clusters", () => {
            that.map.getCanvas().style.cursor = "";
        });
    }
};

bbbMap.KMEANS.prototype.getBounds = function (d) {
    let bounds = new mapboxgl.LngLatBounds();

    d.features.forEach(function (feature) {
        bounds.extend(feature.geometry.coordinates);
    });

    console.log(bounds);

    //bbbMap.kmeansMap.map.fitBounds(bounds);
    return bounds;
};

bbbMap.KMEANS.prototype.getKmeansJSON = function () {
    let that = this,
        i = 0,
        bounds = this.getBounds(this._data),
        geojson = { type: "FeatureCollection" },
        _features = [];

    console.log("Generating kmeans cluster markers", bounds, bounds.getNorthEast(), bounds.getSouthWest());
    this.opt._bounds = bounds;
    while (i < that.opt.k) {
        let _feature = { type: "Feature", geometry: { type: "Point", coordinates: [] } };
        let _prop = { name: "cluster" };
        _feature.geometry.coordinates[0] = that.getRandom(-124.736342, -66.945392); //that.getRandom(bounds.getSouthWest().lng, bounds.getNorthEast().lng);
        _feature.geometry.coordinates[1] = that.getRandom(24.52, 49.38); //that.getRandom(bounds.getSouthWest().lat, bounds.getNorthEast().lat);
        _feature.property = _prop;
        _features.push(_feature);

        i++;
    }

    geojson.features = _features;
    return geojson;
};

bbbMap.KMEANS.prototype.seedClusters = function () {
    this.log("Seeding clusters");
    let i = 0,
        clusterInfo = {},
        that = this,
        _source = null;

    _source = that.getKmeansJSON();

    console.log("Adding kmeans cluster layer", _source);

    console.log("Adding locations", this._data.features);
    this._clusterMarkers = _source.features.map(function (feature, i) {
        const el = document.createElement("div");
        el.className = "cluster";
        el.innerHTML = i;

        // make a marker for each feature and add to the map
        return new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setDraggable(true)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(`<h3>Cluster ${i}</h3><p>Lat: ${feature.geometry.coordinates[1]}</p><p>Lng: ${feature.geometry.coordinates[0]}</p>`)
            )
            .addTo(that.map);
    });

    /*
   this.map.addLayer({
       'id': that.opt.clusterLayerId,
       'type': 'circle',
       'source': {type: 'geojson',  data: _source },
       //'layout': {                'text-field': ['get', 'name']        },
        paint: {
          'circle-radius': 25,
          'circle-color': '#3399ff',
          'circle-stroke-color': 'white',
          'circle-stroke-width': 0,
          'circle-opacity': 0.75
        }
   },
       // Place polygons under labels, roads and buildings.
       'aeroway-polygon');         

*/
};

bbbMap.KMEANS.prototype.addLocationsOld = function () {
    this.log("Adding Locations");
    let that = this,
        ww = 0,
        mm = null,
        f = 0;

    this._locationMarkers = this._data.loc.map(function (loc, i) {
        /*
          return new google.maps.Marker({
             position: loc.loc,
             id: loc.id,
             title: loc.name,
             icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                strokeColor: 'black',
                strokeWeight: 0.25,
                fillColor: '#33cc33',
                fillOpacity: 0.50
             },
             map: that.map
          });*/
    });

    this._locationMarkers.forEach(function (b, j) {
        // b.addListener('rightclick', function (b, j) {
        //    console.log('right clicky');
        // });
    });

    console.log("Generated location complete", that._locationMarkers.length);
    this.log("Added " + that._locationMarkers.length + " locations");
    return this._locationMarkers;
};

bbbMap.KMEANS.prototype.step = function () {
    console.log("kmeans step");
    if (this._clusterMarkers && this._clusterMarkers.length > 0) {
        //that.hideClusterBounds();
        this.assign();
        this.moveCluster();
    } else {
        console.log("No clusters.  Use Start.");
    }
};

bbbMap.KMEANS.prototype.detectMovement = function () {
    //console.log('kmeans detect movement');
    let p1,
        p2,
        m = false;

    this._clusterMarkers.forEach(function (cluster) {
        p1 = cluster.getLngLat();
        p2 = cluster._oldPosition;

        if (p1.lat !== p2.lat && p1.lng !== p2.lng) {
            m = true;
        }
    });

    console.log("Movement detected ", m);
    return m;
};

bbbMap.KMEANS.prototype.run = function () {
    console.log("Running kmeans", this.opt);
    let counter = 0,
        timer,
        that = this;

    if (this._clusterMarkers && this._clusterMarkers.length > 0) {
        //this.hideClusterBounds();

        timer = setInterval(function () {
            that.step();

            if (counter >= that.opt.runLimit) {
                clearInterval(timer);
            }

            if (that.detectMovement() === false) {
                clearInterval(timer);
            }

            counter += 1;
        }, this.opt.runInterval);
    } else {
        console.log("No clusters yet. Use the start button");
    }

    console.log("kmeans done");
};

bbbMap.KMEANS.prototype.assign = function () {
    console.log("Assigning locations to cluster", this._clusterMarkers, this._locationMarkers);
    let a = null,
        that = this;

    //clear assignments
    this._clusterMarkers.forEach(function (c) {
        c._locs = [];
    });

    //Make Assignments
    this._locationMarkers.forEach(function (loc) {
        console.log(loc);
        a = that.closestCentroid(loc.getLngLat(), that._clusterMarkers);
        loc._dist = a.dist;
        loc.clusterID = a.idx;
        that._clusterMarkers[a.idx]._locs.push(loc);
    });
};

bbbMap.KMEANS.prototype.moveCluster = function () {
    console.log("Moving Cluster");
    let centroid,
        cnt = 0,
        that = this;

    this._clusterMarkers.forEach(function (c) {
        if (c._pinMe) {
            c._oldPosition = {
                lat: c.getLngLat().lat,
                lng: c.getLngLat().lng,
            };
            c.setLngLat(centroid);
        } else {
            if (c._locs.length > 0) {
                centroid = that.getCentroid(c._locs);
                c._oldPosition = {
                    lat: c.getLngLat().lat,
                    lng: c.getLngLat().lng,
                };
                c.setLngLat(centroid);
            } else {
                c.setLngLat(that.opt.bermuda);
                c._oldPosition = that.opt.bermuda;
                cnt++;
            }
            //
        }
    });
};

bbbMap.KMEANS.prototype.getCentroid = function (locs) {
    let latXTotal = 0,
        latYTotal = 0,
        lonDegreesTotal = 0,
        latDegreesTotal = 0,
        latDegrees = 0,
        lonDegrees = 0,
        latRadians = 0,
        finalLatRadians = 0;
    finalLatDegrees = 0;
    finalLonDegrees = 0;

    locs.forEach(function (loc) {
        latDegrees = loc.getLngLat().lat;
        lonDegrees = loc.getLngLat().lng;
        latRadians = (Math.PI * latDegrees) / 180;

        latXTotal += Math.cos(latRadians);
        latYTotal += Math.sin(latRadians);

        lonDegreesTotal += lonDegrees;
    });

    finalLatRadians = Math.atan2(latYTotal, latXTotal);
    finalLatDegrees = (finalLatRadians * 180) / Math.PI;
    finalLonDegrees = lonDegreesTotal / locs.length;

    return { lat: finalLatDegrees, lng: finalLonDegrees };
    // return [finalLonDegrees, finalLatDegrees];
};

bbbMap.KMEANS.prototype.distanceBetweenGPoints = function (p1, p2) {
    //console.log('distanceBetweenGPoints');
    //return google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    return p1.distanceTo(p2);
};

bbbMap.KMEANS.prototype.closestCentroid = function (point, centroids) {
    console.log("Finding closestCentroid");
    let min = Infinity,
        index,
        dist = 0,
        that = this;

    centroids.forEach(function (c, i) {
        dist = that.distanceBetweenGPoints(point, c.getLngLat());
        if (dist < min) {
            min = dist;
            index = i;
        }
    });

    return {
        idx: index,
        dist: min,
    };
};

$(function () {
    console.log("Ready");

    bbbMap.initMap();

    $("#startKmeans").on("click", (e) => {
        let k = $("#k").val();
        bbbMap.kmeansMap.setOption("k", k);
        console.log("Start Click", e);
        bbbMap.kmeansMap.start();
    });

    $("#stepKmeans").on("click", (e) => {
        console.log("Step Click", e);
        bbbMap.kmeansMap.step();
    });

    $("#runKmeans").on("click", (e) => {
        console.log("Run Click", e);
        bbbMap.kmeansMap.run();
    });

    $("#logger").on("click", (e) => {
        console.log("toggle logs");
        $("#bbbLogger").toggle();
    });
});
