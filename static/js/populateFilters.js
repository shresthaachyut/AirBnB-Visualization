var url = "https://shresthaachyut.github.io/Project2/airbnb.json"

var neighbourhood_Grp = [];
var neighbourhood = [];
var roomType = [];


addOption = function(selectbox, text, value) {
    var optn = document.createElement("OPTION");
    optn.text = text;
    optn.value = value;
    selectbox.options.add(optn);  
}

function importData(fullData)
{    
    fullData.map(data =>neighbourhood_Grp.push(data.neighbourhood_group));
    fullData.map(data =>neighbourhood.push(data.neighbourhood));
    fullData.map(data =>roomType.push(data.room_type));

    
    neighbourhood_Grp = Array.from(new Set(neighbourhood_Grp));
    neighbourhood = Array.from(new Set(neighbourhood));
    roomType = Array.from(new Set(roomType));    


    var dropdown = d3.select("#selNeighbourhoodGroup").node();
    if (dropdown) {
        for (var i=0; i < neighbourhood_Grp.length;++i){    
            addOption(dropdown, neighbourhood_Grp[i], neighbourhood_Grp[i]);
        }
    }

    var dropdown = d3.select("#selNeighbourhood").node();
    if (dropdown) {
        for (var i=0; i < neighbourhood.length;++i){    
            addOption(dropdown, neighbourhood[i], neighbourhood[i]);
        }
    }

    var dropdown = d3.select("#selRoomType").node();
    if (dropdown) {
        for (var i=0; i < roomType.length;++i){    
            addOption(dropdown, roomType[i], roomType[i]);
        }
    }
}

d3.json(url,importData);