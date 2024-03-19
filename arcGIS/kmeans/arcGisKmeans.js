/*jslint esnext:true*/

/*
https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
bbbMapData.loc.forEach(function(i,j) {
    console.log('{ "type": "Feature", "properties": { "name":"',i.name,'"}, "geometry": { "type": "Point", "coordinates": [ ',i.loc.lat,',',i.loc.lng,', 0.0 ] } },');
})
*/
bbbMap = {};
//let map;

bbbMap.initMap = function() {
      require(["esri/config", "esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer","esri/geometry/geometryEngine"], 
         function(esriConfig, Map, MapView, Graphic, GraphicsLayer, geometryEngine) {

        esriConfig.apiKey = "AAPK0cd2f0f32a494df3ae6c449ac67faabbfaPt0C5s0X6EPcaWH0P-2j_6PUAOrvcB2sERatzoXpK7Cc_z7F5JL40rCzTiDPLT";

       const map = new Map({basemap: "arcgis-dark-gray"});
       const view = new MapView({
          map: map,
         "center":[-96.3537,40.6698],
         "zoom":4, 
         "highlightOptions":{"color": "#B7AC83"}, 
         "popup": {
            "defaultPopupTemplateEnabled": 1,
            "dockEnabled": 1,
            "dockOptions": {
               "buttonEnabled": 0,
               "breakpoint": 0
             }
          },
          container: "map" // Div element
        });
        
         const dataLayer = new GraphicsLayer({id: 'dataLayer'});
         map.add(dataLayer);

         const clusterLayer = new GraphicsLayer({id: 'clusterLayer'});
         map.add(clusterLayer);         
        
         view.when(function(v) {
               
            bbbMap.kmeansMap = new bbbMap.KMEANS(map, view, {$console: $('#bbbLogger'), data: bbbMapData}, {"Graphic": Graphic, "geometryEngine": geometryEngine});   
            
         });
                 
      });     //Require  
     
    // map = map;

           
};

bbbMap.KMEANS = function (map, view, opt, arcgis) {
   console.log('creating kmeans object');
   this.opt = $.extend({}, this.defaults, opt);
   this.map = map;
   this.view = view;
   this.arcgis = arcgis
   this.dataLayer = map.findLayerById('dataLayer');
   this.clusterLayer = map.findLayerById('clusterLayer');
   //this._locationMarkers = [];
   this._loc = opt.loc;
   this._data = opt.data;
   //this._clusterMarkers = [];
   this.logID = 0;
   this.infoWindow = null ; //new google.maps.InfoWindow({'content': 'Info'});
   this.center = { lat: 39.990268, lng: -93.569075 };
   
   this.initKmeans();
   
};

bbbMap.KMEANS.prototype.defaults = {
   k: 15,
   n: 35,
   runInterval: 250,
   runLimit: 25,
   bermuda: {lat: 32.299507, lng: -64.790},
   maxIntensity: 30,
   radius: 0.8,
   opacity: 0.5,
   clusterStyle: [
      {width: 20, height: 20, className: 'custom-clustericon-1'},
      {width: 25, height: 25, className: 'custom-clustericon-2'},
      {width: 30, height: 30, className: 'custom-clustericon-3'},
      ],
   locationsLayerId: 'kmeansLocations',
   clusterLayerId: 'kmeansClusters',
   locationSymbol: {
       type: "simple-marker",
       color: [226, 119, 40, 0.5],  // Orange
       outline: {
           color: [255, 255, 255, 0.25], // White
           width: 0.25
   }},
   clusterSymbol: {
       type: "simple-marker",
       color: [255, 255, 255, 0.25],  // Orange
       outline: {
           color: [226, 119, 40, 0.5], // White
           width: 0.25
   }}     

   
};

bbbMap.KMEANS.prototype.log = function (txt) {
   this.logID++;
   
   if (this.opt.$console) {
      this.opt.$console.prepend(this.logID + '. ' + txt + '<br>');
      
   } else {
      console.log(txt);
   }
};

bbbMap.KMEANS.prototype.getRandom = function (min, max) {
   let rtn = null;
   rtn = Math.random() * (max-min) + min;
   //console.log(min,max,'return', rtn);
   return (rtn);
};


bbbMap.KMEANS.prototype.initKmeans = function () {
      let that = this;
      console.log('Private kmeans init', this.opt);
      this.log('Initialized kmeans');
      document.querySelector('#k').value = this.opt.k;
      
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

bbbMap.KMEANS.prototype.setOption = function (n,v) {
   console.log('Setting option', n, v);
   if (v===undefined) {throw 'please pass a valid value';}
   
   this.opt[n] = v;
};

bbbMap.KMEANS.prototype.start = function () {
   console.log('Starting kmeans', this.opt);
   this.log('Starting kmeans');
   
   this.dm_ = [];
   this.removeList = [];
   
   this.addLocations();
     
   this.removeClusters();
   this.seedClusters();

};

bbbMap.KMEANS.prototype.removeClusters = function () {
      console.log('Removing clusters');
      let that = this;
      if (this.clusterLayer.graphics.items) {
         this.clusterLayer.graphics.items.forEach(function(c) {
            that.clusterLayer.graphics.remove(c);
         });
      }
      
      //this.hideClusterBounds();
      //this._clusterMarkers = [];
};

bbbMap.KMEANS.prototype.addLocations = function(){
   let that = this, temp = [];
   
   //require(["esri/Graphic"], function(Graphic) {
 
   console.log('Adding locations', that._data.features);
   if (that.dataLayer.graphics.items.length > 0) {
      console.log('Markers already added');
   } else {
   temp = that._data.features.map(function (feature, i) {
     
     const geom = {"type": feature.geometry.type, "longitude": feature.geometry.coordinates[0],"latitude":feature.geometry.coordinates[1]};
     const pointGraphic = new that.arcgis.Graphic({
       geometry: (geom),
       symbol: that.opt.locationSymbol,
       attributes: feature.geometry.properties
    });
    that.dataLayer.add(pointGraphic);

     // make a marker for each feature and add to the map
     return pointGraphic;
        
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
   //    });
};

bbbMap.KMEANS.prototype.addLocations2 = function(){
   let that = this;
   
   if (this.map.getLayer(that.opt.locationsLayerId)) {
      console.log('locations are already loaded');
   } else {
    this.map.addSource(that.opt.locationsLayerId, {
        type: 'geojson',
        data: bbbMapData, 
        cluster: false,
        clusterMaxZoom: 14, 
        clusterRadius: 50 
    });

    this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: that.opt.locationsLayerId,
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ]
        }
    });

    this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: that.opt.locationsLayerId,
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: that.opt.locationsLayerId,
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    this.map.on('click', 'clusters', (e) => {
        const features = that.map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        that.map.getSource(that.opt.locationsLayerId).getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
            if (err)
                return;

            that.map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    this.map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties.name;
        //const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`Name: ${name}<br>test`)
        .addTo(bbbMap.kmeansMap.map);
    });

    this.map.on('mouseenter', 'clusters', () => {
        that.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'clusters', () => {
        that.map.getCanvas().style.cursor = '';
    });

   }
   
};

bbbMap.KMEANS.prototype.getBounds = function(d) {
   let bounds = new mapboxgl.LngLatBounds();

   d.features.forEach(function(feature) {
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
        geojson = {'type': 'FeatureCollection'},
        _features = [];
        

   console.log('Generating kmeans cluster markers', bounds, bounds.getNorthEast(), bounds.getSouthWest());
   this.opt._bounds = bounds;
   while (i < that.opt.k) {
      let _feature =  {'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': []}};
      let _prop = { "name":"cluster"};
      _feature.geometry.coordinates[0] =  that.getRandom( -124.736342, -66.945392);//that.getRandom(bounds.getSouthWest().lng, bounds.getNorthEast().lng);
      _feature.geometry.coordinates[1] =  that.getRandom(24.52, 49.38);//that.getRandom(bounds.getSouthWest().lat, bounds.getNorthEast().lat);
      _feature.property = _prop;
      _features.push(_feature);
      
      
      i++;
   }  
   
   geojson.features = _features;
   return geojson;
   
};

bbbMap.KMEANS.prototype.seedClusters = function () {
   this.log('Seeding clusters');
   let i = 0,
   clusterInfo = {},
   that = this;
   //require(["esri/Graphic"], function(Graphic) {   
      while (i < that.opt.k) {
                  
         const geom = {"type": "point", "longitude": that.getRandom(-124.736342, -66.945392),"latitude": that.getRandom(24.52,49.38)};
         const c = new that.arcgis.Graphic({
                geometry: (geom),
                symbol: that.opt.clusterSymbol,
                attributes: {"cluster": i}
             });
             
         that.clusterLayer.add(c); 
             
         c._locs = [];
         //that._clusterMarkers.push(c);             
         i++;
      }      
 //  });
       
};         

bbbMap.KMEANS.prototype.step = function () {
      console.log('kmeans step');
      if (this.clusterLayer.graphics.items && this.clusterLayer.graphics.items.length > 0) {
         //that.hideClusterBounds();
         this.assign();
         this.moveCluster();
      } else {
         console.log('No clusters.  Use Start.');
      }      
};

bbbMap.KMEANS.prototype.detectMovement = function () {
   //console.log('kmeans detect movement');
   let p1, p2, m = false;
   
   this.clusterLayer.graphics.items.forEach(function(cluster, i) {
      console.log('Checking Cluster', i, cluster)
      p1 = cluster.geometry;
      p2 = cluster._oldPosition;
      
      if (p1.latitude !== p2.lat && p1.longitude !== p2.lng) {
         m = true;
      }
   });

   console.log('Movement detected ', m);
   return m;
};

bbbMap.KMEANS.prototype.run = function () {
      console.log('Running kmeans', this.opt);
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
            }
            
            counter += 1;
         }, this.opt.runInterval);
      } else {
         console.log('No clusters yet. Use the start button');
      }

      console.log('kmeans done');
};

bbbMap.KMEANS.prototype.assign = function () {
   console.log('Assigning locations to cluster', this.clusterLayer.graphics.items, this.dataLayer.graphics.items);
   let a = null,
       min = Infinity,
       index,
       dist = 0,
       that = this;
   //clear assignments
   that.clusterLayer.graphics.items.forEach(function(c) {
      c._locs = [];
   });
   
   //For each location
   that.dataLayer.graphics.items.forEach(function(loc, j) {
      console.log('Location ', j);
      //For each kmeans cluster
      min = Infinity;
      that.clusterLayer.graphics.items.forEach(function(c, i) {         
         dist = that.arcgis.geometryEngine.distance(loc.geometry, c.geometry);
         console.log('Dist', dist, ' cluster: ', i);
         
         if (dist < min) {
            console.log('New Min', i);
            min = dist;
            index = i;
         }
      });  
      
      console.log('closestCentroid', index, dist);
      loc._dist = min;
      loc.clusterID = index;
      that.clusterLayer.graphics.items[index]._locs.push(loc);
   });
 
};

bbbMap.KMEANS.prototype.moveCluster = function () {

   let centroid, cnt = 0, that = this, _oldPosition;

   this.clusterLayer.graphics.items.forEach(function (c, i) {
      _oldPosition = {lat: c.geometry.latitude, lng: c.geometry.longitude};
      console.log('Moving Cluster Begin', i, c);
         if (c._locs && c._locs.length > 0) {
            console.log('Locations Cluster Begin', c._locs.length);
            centroid = that.getCentroid(c._locs);            
            
         } else {
            centroid = that.opt.bermuda;         
         }
         
         cnt++;
         
         //Move cluster by removing and adding new one

         console.log('Moving Cluster', i, c, centroid.lat, centroid.lng);
         let newCluster = c.clone();
         newCluster.geometry.latitude = centroid.lat;
         newCluster.geometry.longitude = centroid.lng;
         newCluster._oldPosition = _oldPosition;
         console.log('New cluster def', newCluster);
         
         
         that.clusterLayer.graphics.remove(c);         
         that.clusterLayer.graphics.add(newCluster);            
      
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
         latDegrees = loc.geometry.latitude;
         lonDegrees = loc.geometry.longitude;
         latRadians = Math.PI * latDegrees / 180;
         
         latXTotal += Math.cos(latRadians);
         latYTotal += Math.sin(latRadians);
         
         lonDegreesTotal += lonDegrees;
      });
      
      finalLatRadians = Math.atan2(latYTotal, latXTotal);
      finalLatDegrees = finalLatRadians * 180 / Math.PI;
      finalLonDegrees = lonDegreesTotal / locs.length;
      
      return {lat: finalLatDegrees, lng: finalLonDegrees};
    // return [finalLonDegrees, finalLatDegrees];
};

bbbMap.KMEANS.prototype.distanceBetweenGPoints = function (p1, p2) {
      //console.log('distanceBetweenGPoints');
      //return google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
      return p1.distanceTo(p2);

};

bbbMap.KMEANS.prototype.closestCentroid = function (point, centroids) {
   console.log('Finding closest Centroid', point, centroids);
   let min = Infinity,
       index,
       dist = 0,
       that = this;

  // require(["esri/geometry/geometryEngine"], function(geometryEngine) { 
      
      centroids.forEach(function(c, i) {
         
         dist = that.arcgis.geometryEngine.distance(point, c.geometry);//that.distanceBetweenGPoints(point, c.getLngLat());
         
         if (dist < min) {
            min = dist;
            index = i;
         }
      });  

      return {
         idx: index,
         dist: min
      };      
  // });


};
  
  $(function() {
     console.log('Ready');
     document.getElementById('wwvFlowForm').onsubmit = function(){return false;};
     
     bbbMap.initMap();
      
   $('#startKmeans').on("click", (e) => {
      let k = $('#k').val();
      bbbMap.kmeansMap.setOption('k',k);
      console.log('Start Click',e);
      bbbMap.kmeansMap.start();
   });   
     
     $('#stepKmeans').on("click", (e) => {
        console.log('Step Click',e);
        bbbMap.kmeansMap.step();
     });  
     
     $('#runKmeans').on("click", (e) => {
        console.log('Run Click',e);
        bbbMap.kmeansMap.run();
     });      

     $('#logger').on("click", (e) => {       
        console.log('toggle logs');
        $('#bbbLogger').toggle();
     });          

  });