require([
  "esri/Map",
  "esri/views/MapView",
  "esri/tasks/PrintTask",
  "esri/tasks/support/PrintTemplate",
  "esri/tasks/support/PrintParameters",
  "esri/widgets/Expand"
], function(Map, MapView, PrintTask, PrintTemplate, PrintParameters, Expand) {
  
  // Create the map
  var map = new Map({
    basemap: "streets-navigation-vector"
  });

  // Create the view
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-118.805, 34.027],
    zoom: 13
  });

  // Create the print task
  var printTask = new PrintTask({
    url: "https://utility.arcgisonline.com/ArcGIS/rest/services/Utilities/PrintingTools/GPServer/Export Web Map Task"
  });

  // Create the print template
  var template = new PrintTemplate({
    format: "jpg",
    exportOptions: {
      width: 800,
      height: 600,
      dpi: 96
    },
    layout: "map-only",
    layoutOptions: {
      titleText: "Map Print",
      authorText: "Your Name",
      copyrightText: "© 2024 Your Organization"
    }
  });

  // Print button click handler
  document.getElementById("printButton").addEventListener("click", function() {
    var params = new PrintParameters({
      view: view,
      template: template
    });

    printTask.execute(params).then(function(result) {
      // Open the result in a new window
      window.open(result.url, "_blank");
    }).catch(function(error) {
      console.error("Error printing map: ", error);
    });
  });

});
