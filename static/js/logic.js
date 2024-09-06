// Creating the map object
let myMap = L.map("map", {
    center: [0,0],
    zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load earthquake data
// Using dataset: All Earthquakes from Past Day
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//Get data with d3
d3.json(url).then(function(data) {

    data.features.forEach(function(feature) {

        // Feature variables
        let earthquake = feature.geometry.coordinates[2];
        let earthquake_color;
        let earthquake_opacity;
        let earthquake_size = feature.properties.mag;

        // Color conditionals based on depth
        if (earthquake > 90) {
            earthquake_color = "#e3302d";
            earthquake_opacity = 1;
        } else if (earthquake > 70) {
            earthquake_color = "#e3652d";
            earthquake_opacity = 0.9;
        } else if (earthquake > 50) {
            earthquake_color = "#e3992d";
            earthquake_opacity = 0.8;
        } else if (earthquake > 30) {
            earthquake_color = "#e3c92d";
            earthquake_opacity = 0.7;
        } else if (earthquake > 10) {
            earthquake_color = "#bee32d";
            earthquake_opacity = 0.6;
        } else {
            earthquake_color = "#75e32d";
            earthquake_opacity = 0.5
        }

        // Add circle markers
        let marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {

                color: "black",
                weight: 0.2,
                opacity: 0.5,
                fillOpacity: earthquake_opacity,
                fillColor: earthquake_color,
                radius: earthquake_size * 70000

        }).addTo(myMap);

        // Tooltip
        marker.bindTooltip(
            "Magnitude: " + feature.properties.mag + "<br>" +
            "Location: " + feature.properties.title + "<br>" +
            "Depth: " + earthquake + " km"
        );

    });

    // Legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let depth = [-10, 10, 30, 50, 70, 90];
        let labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", ">90"];
        let colors = [
            "#75e32d",
            "#bee32d",
            "#e3c92d",
            "#e3992d",
            "#e3652d",
            "#e3302d"
        ];

    for (let i=0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '; width: 30px; height: 18px; display: inline-block;"></i> ' +
            labels[i] + "<br>";
    }
        
    return div;

    }

    legend.addTo(myMap);

});