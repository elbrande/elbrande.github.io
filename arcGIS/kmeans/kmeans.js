bbbMap = {};

bbbMap.init = function () {
    bbbMap.initMap();
};

bbbMap.initMap = function () {
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer", "esri/geometry/geometryEngine"], (esriConfig, Map, MapView, Graphic, GraphicsLayer, geometryEngine) =>
        (async () => {
            esriConfig.apiKey = "AAPK0cd2f0f32a494df3ae6c449ac67faabbfaPt0C5s0X6EPcaWH0P-2j_6PUAOrvcB2sERatzoXpK7Cc_z7F5JL40rCzTiDPLT";

            const map = new Map({ basemap: "arcgis-dark-gray" });
            bbbMap.view = new MapView({
                map: map,
                center: [-96.3537, 40.6698],
                zoom: 4,
                highlightOptions: { color: "#B7AC83" },
                popup: {
                    defaultPopupTemplateEnabled: 1,
                    dockEnabled: 1,
                    dockOptions: {
                        buttonEnabled: 0,
                        breakpoint: 0,
                    },
                },
                container: "map", // Div element
            });

            const dataLayer = new GraphicsLayer({ id: "dataLayer" });
            map.add(dataLayer);

            const clusterLayer = new GraphicsLayer({ id: "clusterLayer", effect: "bloom()" });
            map.add(clusterLayer);

            bbbMap.view.when(async (v) => {
                console.log("View is ready.  Setup UI and Sketch Tools", bbbMap.view);

                data = await fetch("locations.json");
                let jsonData = await data.json();
                jsonData = jsonData.filter((d) => d.country === "US");
                jsonData = jsonData.slice(0, 1000);

                bbbMap.ui();
                bbbMap.kmeansMap = new bbbMap.KMEANS(map, bbbMap.view, { data: jsonData }, { Graphic: Graphic, geometryEngine: geometryEngine });
                document.body.style.visibility = "";
            });
        })()); //end require

    // map = map;
};

bbbMap.ui = function () {
    console.log("Setting up user interface");
    bbbMap.parameters = document.getElementById("bbbMapParameters");
    bbbMap.logContainer = document.getElementById("bbbLogger");

    bbbMap.view.ui.add(bbbMap.parameters, "top-right");
    bbbMap.view.ui.add(bbbMap.logContainer, "top-right");

    document.getElementById("startKmeans").addEventListener("click", (e) => {
        let k = document.getElementById("k").value;
        bbbMap.kmeansMap.setOption("k", k);
        console.log("Start Click", e);
        bbbMap.kmeansMap.start();
    });

    document.getElementById("stepKmeans").addEventListener("click", (e) => {
        console.log("Step Click", e);
        bbbMap.kmeansMap.step();
    });

    document.getElementById("runKmeans").addEventListener("click", (e) => {
        console.log("Run Click", e);
        bbbMap.kmeansMap.run();
    });

    document.getElementById("logger").addEventListener("click", (e) => {
        console.log("toggle logs");
        if (bbbMap.logContainer.style.visibility) {
            bbbMap.logContainer.style.visibility = "";
        } else {
            bbbMap.logContainer.style.visibility = "hidden";
        }
    });
};
bbbMap.KMEANS = function (map, view, opt, arcgis) {
    console.log("creating kmeans object");
    this.opt = Object.assign({}, this.defaults, opt);
    this.map = map;
    this.view = view;
    this.arcgis = arcgis;
    this.dataLayer = map.findLayerById("dataLayer");
    this.clusterLayer = map.findLayerById("clusterLayer");
    //this._locationMarkers = [];
    this._loc = opt.loc;
    this._data = opt.data;
    //this._clusterMarkers = [];
    this.logID = 0;
    this.infoWindow = null; //new google.maps.InfoWindow({'content': 'Info'});
    this.center = { lat: 39.990268, lng: -93.569075 };
    this.assigments = [];

    this.initKmeans();
};

bbbMap.KMEANS.prototype.defaults = {
    k: 15,
    n: 35,
    runInterval: 250,
    runLimit: 60,
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
    locationSymbol: {
        type: "simple-marker",
        color: [192, 192, 192, 0.2],
        size: 4,
        outline: {
            color: [255, 255, 255, 0.2], // White
            width: 0,
        },
    },
    clusterSymbol: {
        type: "simple-marker",
        color: [226, 119, 40, 0.5],
        size: 12,
        outline: {
            color: [255, 255, 255, 0.25], // White
            width: 0.5,
        },
    },
};

bbbMap.KMEANS.prototype.log = function (txt) {
    this.logID++;

    const card = document.createElement("calcite-card");
    const date = new Date();
    const dateString = date.toISOString();

    card.innerHTML = `<span slot="description">${this.logID}: ${txt} </span> `; //dateString + "<br>" + description;(${dateString})

    bbbMap.logContainer.prepend(card);

    /*
    if (bbbMap.logContainer) {
        let div = document.createElement("div");
        div.innerHTML = `${this.logID}: ${txt}`;
        
        bbbMap.logContainer.prepend(div);
    } else {
        console.log(txt);
    }
        */
};

bbbMap.KMEANS.prototype.getRandom = function (min, max) {
    let rtn = null;
    rtn = Math.random() * (max - min) + min;

    return rtn;
};

bbbMap.KMEANS.prototype.initKmeans = function () {
    let that = this;
    console.log("Private kmeans init", this.opt);
    this.log("Initialized kmeans");
    document.querySelector("#k").value = this.opt.k;

    //setup drag and drop
    // require(["esri/Graphic"],function(Graphic) {
    /*
         that.view.on("drag", function(evt) {
          evt.stopPropagation();
          let screenPoint = {
              x: evt.x,
              y: evt.y
          };

          console.log(evt.action, screenPoint);
          
          that.view.hitTest(screenPoint).then(function(response) {
            var graphic = response.results[0].graphic;
            if (graphic) {
               console.log('Graphic', response.results[0].mapPoint);
               */
    /*var newGraphic = Graphic({
                     geometry: response.results[0].mapPoint,
                     symbol: that.locationSymbol
                 });

                 that.view.graphics.remove(graphic);
                 that.view.graphics.add(newGraphic);       
*/
    //  }
    //    });
    //   });

    //  });
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
    bbbMap.kmeansMap.clusterLayer.removeAll();
};

bbbMap.KMEANS.prototype.addLocations = function () {
    let that = this,
        temp = [];

    //require(["esri/Graphic"], function(Graphic) {

    console.log("Adding locations", that._data.features);
    if (that.dataLayer.graphics.items.length > 0) {
        console.log("Markers already added");
    } else {
        //temp = that._data.features.map(function (feature, i) {
        //let data = that._data.filter((d) => d.country === "US");
        temp = that._data.map(function (feature, i) {
            //const geom = { type: feature.geometry.type, longitude: feature.geometry.coordinates[0], latitude: feature.geometry.coordinates[1] };
            const geom = { type: "point", longitude: feature.longitude, latitude: feature.latitude };
            const pointGraphic = new that.arcgis.Graphic({
                geometry: geom,
                symbol: that.opt.locationSymbol,
                //attributes: feature.geometry.properties,
                attributes: { name: feature.name, city: feature.city },
            });
            that.dataLayer.add(pointGraphic);

            // make a marker for each feature and add to the map
            return pointGraphic;
        });
    }
    that.log(`Added ${that._data.length} features`);
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
    //    });
};

bbbMap.KMEANS.prototype.addLocations2 = function () {
    let that = this;

    if (this.map.getLayer(that.opt.locationsLayerId)) {
        console.log("locations are already loaded");
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
        that = this;
    //require(["esri/Graphic"], function(Graphic) {
    that.assigments = [];
    while (i < that.opt.k) {
        let idx = Math.floor(Math.random() * that._data.length);
        let point = that._data[idx];

        //const geom = { type: "point", longitude: that.getRandom(-124.736342, -66.945392), latitude: that.getRandom(24.52, 49.38) };
        const geom = { type: "point", longitude: point.longitude - 0.1, latitude: point.latitude + 0.1 };
        let c = new that.arcgis.Graphic({
            geometry: geom,
            symbol: that.opt.clusterSymbol,
            attributes: { cluster: i },
        });

        c._oldPosition = { lat: "", lng: "" };
        c._locs = [];
        that.clusterLayer.add(c);

        that.assigments.push({ id: i, geometry: geom, oldGeometry: {}, locs: [] });

        //that._clusterMarkers.push(c);
        i++;
    }
    that.log(`Added ${i} clusters`);
    //  });
};

bbbMap.KMEANS.prototype.step = function () {
    console.log("kmeans step");
    if (this.clusterLayer.graphics.items && this.clusterLayer.graphics.items.length > 0) {
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
        m = false,
        cntStops = 0,
        cntMoves = 0,
        that = this;

    //this.clusterLayer.graphics.items.forEach(function (cluster, i) {
    this.assigments.forEach((cluster, i) => {
        console.log("Checking Cluster", i, cluster);
        p1 = cluster.geometry;
        p2 = cluster.oldGeometry;

        if (p1.latitude !== p2.latitude && p1.longitude !== p2.longitude) {
            m = true;
            cntMoves++;
        } else {
            cntStops++;
        }
    });

    console.log("Movement detected ", m);
    that.log(`Movement detection: ${cntStops} optimized; ${cntMoves} moving`);
    return m;
};

bbbMap.KMEANS.prototype.run = function () {
    console.log("Running kmeans", this.opt);
    let counter = 0,
        timer,
        that = this;

    if (this.clusterLayer.graphics.items && this.clusterLayer.graphics.items.length > 0) {
        //this.hideClusterBounds();

        timer = setInterval(function () {
            that.step();

            if (counter >= that.opt.runLimit) {
                clearInterval(timer);
            }

            if (that.detectMovement() === false) {
                clearInterval(timer);
                that.log(`No cluster was moved.  Locations Optimized.`);
            }

            counter += 1;
        }, this.opt.runInterval);
    } else {
        console.log("No clusters yet. Use the start button");
    }

    console.log("kmeans done");
};

bbbMap.KMEANS.prototype.assign = function () {
    console.log("Assigning locations to cluster", this.clusterLayer.graphics.items, this.dataLayer.graphics.items);
    let a = null,
        min = Infinity,
        index,
        dist = 0,
        that = this,
        cnt = 0,
        geom;
    //clear assignments
    that.clusterLayer.graphics.items.forEach(function (c) {
        c._locs = [];
        const cluster = that.assigments.find((a) => a.id === c.attributes.cluster);
        cluster.locs = [];
    });

    //For each location
    that.dataLayer.graphics.items.forEach(function (loc, j) {
        //console.log("Location ", j);
        //For each kmeans cluster
        min = Infinity;
        that.clusterLayer.graphics.items.forEach(function (c, i) {
            dist = that.arcgis.geometryEngine.distance(loc.geometry, c.geometry);
            //console.log(loc.attributes.city, "Dist", dist, " cluster: ", i, c);

            cnt++;
            if (dist < min) {
                min = dist;
                index = i;
                geom = loc.geometry;
            }
        });

        //console.log("closestCentroid", index, dist);
        loc._dist = min;
        loc.clusterID = index;
        console.log("Assignment complete", min, index);
        that.clusterLayer.graphics.items[index]._locs.push(loc);

        let assigment = that.assigments.find((a) => a.id === index);
        assigment.locs.push({ d: min, loc: j, geometry: geom });
    });

    that.log(`Assigment Complete ${cnt} calculations`);
};

bbbMap.KMEANS.prototype.moveCluster = function () {
    let centroid,
        cnt = 0,
        that = this,
        _oldPosition;

    //this.clusterLayer.graphics.items.forEach(function (c, i) {

    that.assigments.forEach((c, i) => {
        //for (const c in that.assigments) {
        //        _oldPosition = { lat: c.geometry.latitude, lng: c.geometry.longitude };

        console.log("Moving Cluster", c.id, c);
        c.oldGeometry = Object.assign({}, c.geometry); // lat: c.geometry.latitude, lng: c.geometry.longitude };

        console.log("Moving Cluster Begin", i, c);

        if (c.locs && c.locs.length > 0) {
            console.log("Locations Cluster Begin", c.locs.length, c.locs);
            centroid = that.getCentroid(c.locs);
            console.log("Centroid", centroid);
        } else {
            console.log("No assigned locations.  Move to bermuda triangle");
            centroid = that.opt.bermuda;
        }

        cnt++;
        c.geometry.latitude = centroid.lat;
        c.geometry.longitude = centroid.lng;

        //Move cluster by removing and adding new one

        let graphic = bbbMap.kmeansMap.clusterLayer.graphics.items.find((g) => g.attributes.cluster === c.id);
        console.log("Moving Cluster", c.id, graphic, i, c, centroid.lat, centroid.lng);
        let moveGraphic = graphic.clone();
        moveGraphic.geometry.latitude = centroid.lat;
        moveGraphic.geometry.longitude = centroid.lng;
        //newCluster._oldPosition = _oldPosition;
        console.log("New cluster def", moveGraphic);

        that.clusterLayer.graphics.remove(graphic);
        that.clusterLayer.graphics.add(moveGraphic);
    });

    that.log(`Movement step for ${cnt} clusters complete `);
};

bbbMap.KMEANS.prototype.getCentroidxxx = function (locs) {
    let latXTotal = 0,
        latYTotal = 0,
        lonDegreesTotal = 0,
        latDegreesTotal = 0,
        latDegrees = 0,
        lonDegrees = 0,
        latRadians = 0,
        finalLatRadians = 0,
        finalLatDegrees = 0,
        finalLonDegrees = 0;

    locs.forEach(function (loc) {
        latDegrees = loc.latitude;
        lonDegrees = loc.longitude;
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
        latDegrees = loc.geometry.latitude;
        lonDegrees = loc.geometry.longitude;
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
    console.log("Finding closest Centroid", point, centroids);
    let min = Infinity,
        index,
        dist = 0,
        that = this;

    // require(["esri/geometry/geometryEngine"], function(geometryEngine) {

    centroids.forEach(function (c, i) {
        dist = that.arcgis.geometryEngine.distance(point, c.geometry); //that.distanceBetweenGPoints(point, c.getLngLat());

        if (dist < min) {
            min = dist;
            index = i;
        }
    });

    return {
        idx: index,
        dist: min,
    };
    // });
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
    //   bbbMap.init();

    console.log("Ready");
    bbbMap.init();
});
