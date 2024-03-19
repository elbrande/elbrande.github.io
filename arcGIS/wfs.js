 
 require([
        "esri/layers/WFSLayer",
        "esri/layers/ogc/wfsUtils",
        "esri/Graphic",
        "esri/geometry/geometryEngine"
      ], function (WFSLayer, wfsUtils, Graphic, geometryEngine) {
   let wfsCapabilities;
   
   const url = "https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/natl_fcst_wx_chart/MapServer/WFSServer?request=GetCapabilities&service=WFS";

      const layer = new WFSLayer({
        url: url,
        name: "Day_1_Mixed_Precipitation", // name of the FeatureType
        popupEnabled: false,
        renderer: {type: "simple",
         symbol: {
            type: "simple-fill",
            outline: {color: [179,160,160,0.66]},
            color: [250, 240, 105, 0.25]
            }}
      });
      bbbMap.map.add(layer);
      layer.when(() => {
         bbbMap.view.goTo(layer.fullExtent);
         
         bbbMap.view.on("click", (event) => {
            bbbMap.view.hitTest(event).then((response) => {
               response.results.forEach(function(result){
                  if (result.graphic && result.graphic.layer && result.graphic.layer === layer) {
                     console.log('Weather layer clicked.  create the graphics');
                     addWeatherGraphics(result.graphic);
                  }
                  
                  if (result.graphic && result.graphic.layer && result.graphic.layer === bbbMap.ui.sketchVM.layer && result.graphic.attributes && result.graphic.attributes.weatherShape) {
                     
                     console.log('Weather graphic was clicked.  filter the things');
                     bbbMap.ui.doGraphicFilter();
                     bbbMap.ui.sketchVM.update([result.graphic],{tool: "transform"});
                  }                  
               });//reponse foreach loop
            });//hittest
         });// view click
         
      });  //layer when
      
      function addWeatherGraphics(graphic) {
         console.log('Adding all weather graphics', graphic)  ;
         //todo better way to decide if we should draw?  
         if (bbbMap.ui.sketchVM.layer.graphics.length === 0){
            let weatherGeom, weatherGraphic, area;
            graphic.geometry.rings.forEach(function(r, i) {
               weatherGeom = graphic.geometry.clone();
               weatherGeom.rings = [];
               weatherGeom.addRing(r);
               
               area = geometryEngine.geodesicArea(weatherGeom, 'square-miles');
               console.log('Area', area);
               
               weatherGeom = geometryEngine.buffer(weatherGeom, 5, 'miles');
               
               weatherGraphic = new Graphic({"layer": bbbMap.ui.sketchLayer, "geometry": weatherGeom, "attributes": {weatherShape: true}, symbol: {type: 'simple-fill', color:[230,4,4,0.4]}});
               bbbMap.ui.sketchLayer.add(weatherGraphic);
            })
         }
      }
         
});