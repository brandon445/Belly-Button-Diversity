function buildMetadata(sample) {
  // var url = `/metadata/${sample}`;
  // d3.json(`/metadata/${sample}`).then(function(d) {
  //   mData = Object.entries(d);

  //   var webPanelurl = d3.select("#sample-metadata");
  //   webPanelurl.html("");
  // })

  // use `d3.json to feth the methods
  d3.json(`/metadata/${sample}`).then(function(d) {
    var webPanelurl = d3.select("#sample-metadata");
    console.log(d);
    webPanelurl.html("");

    Object.entries(d).forEach(function([key, value]) {
      var paragraph = webPanelurl.append("p");
      paragraph.text(`${key}: ${value}`);
    });


  })
  };
  


  function buildCharts(sample) {
    console.log("I'm inside buildCharts");
    d3.json(`/samples/${sample}`).then(function(d) {
      var otu_ids = d.otu_ids
      var otu_labels = d.otu_labels
      var sample_values = d.sample_values

      console.log(otu_labels);

      var bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        text: otu_labels,
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      };

      var bubbleData = [bubbleTrace];

      var bubblelayout = {
        xaxis: {title: "OTU ID"}
      };

      Plotly.newPlot("bubble", bubbleData, bubblelayout);

      // Pie Chart
      d3.json(`/samples/${sample}`).then(function(data) {
        var pieValue = data.sample_values.slice(0,10)
        var pieLabel = data.otu_ids.slice(0,10)
        var pieHover = data.otu_labels.slice(0,10)

        var data = [{
          values: pieValue,
          labels: pieLabel,
          type: "pie"
        }];
        Plotly.newPlot("pie", data);

      })

      // use the same variables we defined
      // use .slice(0,10)
      // pie data ==> values,labels, type:pie
      // ==> means "takes"

    });
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  