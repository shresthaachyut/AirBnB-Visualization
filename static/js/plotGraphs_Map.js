//url = "http://127.0.0.1:5000/data"

url = "https://shresthaachyut.github.io/Project2/airbnb3.json";
var filterButton = d3.select("#filter-btn");
var airbnbData ;
var alreadyExits = 0;
var temp;
var map;

function createPieChart(count)
{
  var labels_name = [];
  var labels_value = [];

  for(var index = 0; index<count.length; index+=1){
    labels_name.push(count[index].key);
    labels_value.push(count[index].value);
  }
  var trace1 = {
    labels: labels_name,
    values: labels_value,
    type: "pie",
    marker: { color: ['red', 'green', 'blue'] }
    };

  var data = [trace1];

  var layout = {
    title: "% Distribution by Room Type",
  };

  Plotly.newPlot("pie-id", data, layout);
}

function createBarChart(average)
{
  var x_values = [];
  var y_values = [];

  for(var index = 0; index<average.length; index+=1){
    x_values.push(average[index].room_type);
    y_values.push(average[index].AvgPrice);
  }
  var trace1 = {
    x: x_values,
    y: y_values,
    type: "bar",
    marker: { color: ['red', 'green', 'blue'] }
  };

  var data = [trace1];

  var layout = {
    title: "Average Prices by Room Type",
    xaxis: { title: "Room Type"},
    yaxis: { title: "Avg. Price"}
  };
  Plotly.newPlot("bar-id", data, layout);
}

function createHBarChart(average)
{
  var x_values = [];
  var y_values = [];

  for(var index = 0; index<average.length; index+=1){
    x_values.push(average[index].AvgPrice);
    y_values.push(average[index].neighbourhood);
    
  }
  var x_values = x_values.sort((a, b) => a - b);


  var trace1 = {
    x: x_values,
    y: y_values,
    type: "bar",
    orientation: 'h'
  };

  var data = [trace1];

  var layout = {
    title: "Average Prices By Neighbourhood",
    xaxis: { title: "Avg. Price"},
    //yaxis: { title: }
    
  };
  Plotly.newPlot("hbar-id", data, layout);
}

function createMap(locations)
{
      console.log(" I am inside map")
        var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors,<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
      });
        map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 12,
        preferCanvas: true,
        layers: [lightmap]
        }); 
        map.addLayer(locations);
        temp = locations;      
                
      var baseMaps = {
      "Light Map": lightmap
      };  
  
    var overlayMaps = {
      "Locations": locations
    };

  L.control.layers(baseMaps,overlayMaps, {
    collapsed: true
  }).addTo(map);
}

function updateMap(locations)
{
  map.removeLayer(temp);
  map.addLayer(locations);
}

function createMarkers(response) {
  var allData = response;
  var houseMarkers = [];
  
  for (var index = 0; index < allData.length; index++) {
    var house = allData[index];    
    var houseMarker = L.marker([house.latitude, house.longitude])
       .bindPopup("<h3>Host: " + house.host_name + "<h3><h3>Room Type: " + house.room_type + "<h3>");
     houseMarkers.push(houseMarker);
   }
   
   return houseMarkers;   
}

function filterData(allData){
  console.log(allData);
  var inputNeighbourhoodGrp = d3.select("#selNeighbourhoodGroup");
  var inputNeighbourhoodGrpValue = inputNeighbourhoodGrp.property("value");
  console.log(inputNeighbourhoodGrpValue);
  
  var inputNeighbourhood = d3.select("#selNeighbourhood");
  var inputNeighbourhoodValue = inputNeighbourhood.property("value");
  console.log(inputNeighbourhoodValue);
  
  var inputRoomType = d3.select("#selRoomType");
  var inputRoomTypeValue = inputRoomType.property("value");
  console.log(inputRoomTypeValue);
       
  var filteredData = allData;
    
  if(inputNeighbourhoodGrpValue !=='All'){
      
    filteredData = filteredData.filter(info => info.neighbourhood_group===inputNeighbourhoodGrpValue);
    console.log(filteredData);
  }
  
  if(inputNeighbourhoodValue !=='All'){
      
    filteredData = filteredData.filter(info =>info.neighbourhood===inputNeighbourhoodValue);
    console.log(filteredData);
  }
  
  if(inputRoomTypeValue !=='All'){
      
    filteredData = filteredData.filter(info =>info.room_type===inputRoomTypeValue);
    console.log(filteredData);
  }
  return filteredData;
}

function calculateCount(jsonObject)
{
  var occurences = jsonObject.reduce(function (r, row) {
    r[row.room_type] = ++r[row.room_type] || 1;
    return r;
  }, {});

var result = Object.keys(occurences).map(function (key) {
    return { key: key, value: occurences[key] };
});

//console.log(result);
return result;
}

function calculateAvgByRoomType(jsonObject)
{
  var result = alasql('SELECT room_type, avg(price) AS AvgPrice \
  FROM ? \
  GROUP BY room_type \
  ORDER BY bytes DESC',[jsonObject]);
  
  return result;
}

function calculateAvgByNeighbourhood(jsonObject)
{
  var result = alasql('SELECT neighbourhood, avg(price) AS AvgPrice \
  FROM ? \
  GROUP BY neighbourhood \
  ORDER BY bytes DESC',[jsonObject]);
  console.log(result);
  return result;

}

function init(response){
  airbnbData = response;
  console.log(response);
  var locationMarkers = createMarkers(response);
  createMap(L.layerGroup(locationMarkers));
  
  var count = calculateCount(response);  
  createPieChart(count);

  var average = calculateAvgByRoomType(response);
  createBarChart(average);

  var averageByNeighbourhood = calculateAvgByNeighbourhood(response);
  createHBarChart(averageByNeighbourhood);
}

/*
filterButton.on("click",function(){
  var afterFiltering = filterData(airbnbData);
  locationMarkers = createMarkers(afterFiltering);
  updateMap(L.layerGroup(locationMarkers));

  var count = calculateCount(afterFiltering);  
  createPieChart(count);

  var averageByRoomType = calculateAvgByRoomType(afterFiltering);
  createBarChart(averageByRoomType);

  var averageByNeighbourhood = calculateAvgByNeighbourhood(afterFiltering);
  createHBarChart(averageByNeighbourhood);

});
*/

function handleChange(){
  var afterFiltering = filterData(airbnbData);
  locationMarkers = createMarkers(afterFiltering);
  updateMap(L.layerGroup(locationMarkers));

  var count = calculateCount(afterFiltering);  
  createPieChart(count);

  var averageByRoomType = calculateAvgByRoomType(afterFiltering);
  createBarChart(averageByRoomType);

  var averageByNeighbourhood = calculateAvgByNeighbourhood(afterFiltering);
  createHBarChart(averageByNeighbourhood);
}

d3.selectAll("#selNeighbourhoodGroup").on("change", handleChange);
d3.selectAll("#selNeighbourhood").on("change", handleChange);
d3.selectAll("#selRoomType").on("change", handleChange);

  
// Initialize
d3.json(url, init);

