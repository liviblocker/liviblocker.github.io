function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });

}
// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // Filter the data for the object with the desired sample number
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = samplesResult.otu_ids;
    var otuLabels = samplesResult.otu_labels;
    var sampleValues = samplesResult.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topTenIds = otuIds.slice(0, 10);
    var idsSorted = topTenIds.reverse();

    var topTenValues = sampleValues.slice(0, 10);
    var valuesSorted = topTenValues.reverse();

    var yticks = idsSorted.map(otuIds => `OTU ${otuIds}`);
    var xticks = valuesSorted;
    var labels = otuLabels.slice(0, 10).reverse();
    
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      marker: {
        color: "rgb(189, 62, 23)",
        bordercolor: "white",
      }
    };
    
    var barData = [trace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures",
      xaxis: { title: "Sample Values"},
      plot_bgcolor: "rgb(189, 188, 188)",
      paper_bgcolor: "rgb(189, 188, 188)",
     };
  
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);  

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {size: sampleValues, color: otuIds, colorscale: "Portland"}
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:{
        text: "Bacteria Cultures per Sample"},
      xaxis: {
        title: {
          text: "OTU ID"
        }
      },
      hovermode: "closest",
      height: 600,
      plot_bgcolor: "rgb(189, 188, 188)",
      paper_bgcolor: "rgb(189, 188, 188)",
      font: {
        color: "black"
      }
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    // 3. Create a variable that holds the washing frequency.
    var frequency = result.wfreq
    console.log(frequency)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: frequency,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      gauge: {
        axis: {
          range: [null, 10],
          tickwidth: 1, tickcolor: "black", dtick: 2
        },
        bar: { 
          color: "white",
          tickwidth: 2
        },
        borderwidth: 2,
        bordercolor: "white",
        steps: [
          {range: [0, 2], color: "rgb(55, 10, 5)"},
          {range: [2, 4], color: "rgb(189, 62, 23)"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "greenyellow"},
          {range: [8, 10], color: "green"}
        ],
      }
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 0, b: 0},
      plot_bgcolor: "rgb(189, 188, 188)",
      paper_bgcolor: "rgb(189, 188, 188)",
      font: {
        color: "black"
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}