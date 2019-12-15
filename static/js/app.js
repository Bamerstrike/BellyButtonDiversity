// call json 
const bioData = "../../samples.json"

// make dataset readable with javascript
Dataset = d3.json(bioData)

// initialize names, metadata, and data array
var names = [];
var infos = [];
var samples = [];

// call menu
var menu = d3.select("#selDataset").selectAll("option");

// create the initial page and menu
function init(){
    Dataset.then(function(data){
        console.log(data.names);
        console.log(data.metadata);
        console.log(data.samples);
        console.log(data);

        names = data.names;
        infos = data.metadata;
        samples = data.samples;

        // create the menu
        menu.data(names)
            .enter()
            .append("option")                
            .attr("value",function(name){return name})
            .html(function(name){return name});
    });
}

init();


// Create a function for when the menu changes
function optionChanged(value){  
    // console.log(value);  
    // Filter selection info
    var info = infos.filter(name => (name.id==value))[0];    
    var sample = samples.filter(name => (name.id==value))[0];
    


    // var thisSample = sample.filter(thisSample => ())
    var otu_ID = sample["otu_ids"];
    var labeled_otu_ID = otu_ID;
    var otu_sample_values = sample["sample_values"];
    var otu_labels = sample["otu_labels"];

    // for(var i = 0; i<lableled_otu_ID.length; i++){
    //     labeled_otu_ID[i] = "otu_ID "+labeled_otu_ID[i];
    // }

    labeled_otu_ID = labeled_otu_ID.map(x=> "otu_ID "+x);

    // plot bar data
    //=====================================================
    var barData = [{
        x: otu_sample_values,
        y: labeled_otu_ID,
        type: "bar",
        orientation:"h",
        text: otu_labels
    }];

    Plotly.newPlot("bar",barData);
    //=====================================================

    // plot gauge data
    //=====================================================
    var gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: info["wfreq"],
            title: { text: "Wash Frequency" },
            type: "indicator",
            gauge:{
                axis:{ range:[null,9] },
                steps:[
                    {range:[0,1], color: "#eedfda"},
                    {range:[1,2], color: "#d5ddda"},
                    {range:[2,3], color: "#c0ccc7"},
                    {range:[3,4], color: "#aabbb5"},
                    {range:[4,5], color: "#95aaa2"},
                    {range:[5,6], color: "#809890"},
                    {range:[6,7], color: "#6b877d"},
                    {range:[7,8], color: "#56766a"},
                    {range:[8,9], color: "#416558"}
                ]
            },
            mode: "gauge+number"
        }
    ];
    
    Plotly.newPlot("gauge", gaugeData);
    //=====================================================


    // plot bubble chart
    //=====================================================
    var bubbleData = [{
        x: otu_ID,
        y: otu_sample_values,
        mode: "markers",
        marker:{size: otu_sample_values.map(x=>x/2),
            color:otu_ID.map(x => getColor(x))},
        text: otu_labels
    }];

    var layout = {xaxis:{title:"OTU ID"}};
    
    Plotly.newPlot("bubble",bubbleData,layout);
    //=====================================================

    // update Demographics Info Data
    infoKeys = Object.keys(info);    
    var sampleMetaData = d3.select("#sample-metadata").selectAll("p");


    // populate the demographic data
    sampleMetaData.data(infoKeys)
        .enter()
        .append("p")
        .merge(sampleMetaData)
        .text(function(key){
            return `${key.toUpperCase()}: ${info[key]}`;
        });
}

// creates a color scheme for the bubble chart
function getColor(value){
    value = Math.floor(255/value *1000);
    return `rgb(0,${value},0)`
}

