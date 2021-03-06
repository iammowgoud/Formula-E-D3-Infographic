function addDefs() {
  var defs = mainSVG.append("defs");

  defs.selectAll(null)
    .data(data)
    .enter()
    .append("pattern")
    .attr("id", (d) => getID(d["Pilot"]))
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", function (d) {
      return "imgs/" + (d["image"] || "pp.png")
    });

  defs.append("svg:pattern")
    .attr("id", "car")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternUnits", "objectBoundingBox")
    .append("svg:image")
    .attr("xlink:href", 'imgs/car.png')
    .attr("height", 64)
    .attr("width", 25);

  mainSVG
    .append("line")
    .classed("hide", true)
    .attr("id", "x-marker")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")
    .attr("x1", 90)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0)
    .style("opacity", 0.6)
    .attr("stroke", "#d1cba8")
    .attr("stroke-width", 2);

  mainSVG
    .append("line")
    .classed("hide", true)
    .attr("id", "y-marker")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")
    .attr("x1", 0)
    .attr("y1", height - 20)
    .attr("x2", 0)
    .attr("y2", height - 20)
    .style("opacity", 0.6)
    .attr("stroke", "#d1cba8")
    .attr("stroke-width", 2);

  mainSVG
    .append("text")
    .classed("hide", true)
    .attr("id", "text-marker")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "#b89595");
}

function draw() {
  console.log("==> draw()");

  title.text("Top Formula E Pilots for the last 3 seasons");

  // Main Viz
  main.style("max-width", `${CONFIG.width}px`)
    .style("margin", "0 auto")

    // Main SVG
    .append("svg")
    .attr("id", "mainSVG")
    .attr("width", width + CONFIG.margin.left + CONFIG.margin.right)
    .attr("height", height + CONFIG.margin.top + CONFIG.margin.bottom)


  mainSVG = d3.select("#mainSVG");
  addDefs();

  // Circles Group
  mainSVG
    .append("g")
    .attr("id", "avatar-group")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init Circles
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
    .classed("avatar", true)
    .attr("pilot", d => getID(d["Pilot"]))

    // Circle attrs
    .attr("cx", (d, i) => xScale(i))
    .attr("cy", CONFIG.margin.top)
    .attr("fill", d => "url(#" + getID(d["Pilot"]) + ")")
    .attr("r", 35);
  // .attr("stroke", "black");

  mainSVG
    .append("g")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.right + ")")

    .selectAll("text")
    .data(data)
    .enter().append("text")
    .classed("label", true)
    .attr("pilot", d => getID(d["Pilot"]))
    .text((d, i) => d["Pilot"])
    // .attr("transform", "translate(-25, 0)")

    .attr("x", (d, i) => (xScale(i) - 20) + "px")
    .attr("y", "110px")
    .attr("dominantBaseline", "middle")
    .attr("textAnchor", "middle");
}

function bar() {

  stopPulse();
  console.log("==> bar()");

  title.html("How <u>many times</u> did each rank 1st ?");

  var delay = 50;
  var duration = 800;


  mainSVG
    .selectAll("circle.avatar")
    .transition()
    .attr("cy", (d, i) => height - CONFIG.margin.bottom)
    .delay((d, i) => {
      return i * delay;
    })
    .duration(duration)
    .ease(d3.easeQuad);

  mainSVG
    .selectAll("text")
    .transition()
    .attr("y", (d, i) => height + 10 + "px")
    .delay((d, i) => {
      return i * delay;
    })
    .duration(duration)
    .ease(d3.easeQuad);


  //Cars

  mainSVG
    .append("g")
    .attr("id", "cars")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init Circles
    .selectAll("rect")
    .data(data)
    .enter().append("rect")
    .classed("car", true)

    // rect attrs
    .attr("x", (d, i) => xScale(i) - 12)
    .attr("y", (d, i) => height - 100)
    .attr("height", (d, i) => 0)
    .attr("width", "25px")
    .attr("height", "64px")
    .attr("fill", "url(#car)")
    .style("opacity", "0")

    .transition()
    .attr("y", (d, i) => height - 150 - yScalePosition(d["Position"]))
    .style("opacity", "1")
    .delay((d, i) => {
      return duration + (i * delay) - 10;
    })
    .duration(duration)
    .ease(d3.easeQuad);

  //Bars

  mainSVG
    .append("g")
    .attr("id", "bar")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init Circles
    .selectAll("rect")
    .data(data)
    .enter().append("rect")
    .classed("bar", true)

    // bar attrs
    .attr("x", (d, i) => xScale(i) - 7)
    .attr("y", (d, i) => height - 100)
    .attr("height", (d, i) => 0)
    .attr("width", "15px")
    .attr("fill", "#f92700")
    .style("opacity", "0.5")

    .transition()
    .attr("x", (d, i) => xScale(i) - 3)
    .attr("y", (d, i) => height - 90 - yScalePosition(d["Position"]))
    .attr("height", (d, i) => yScalePosition(d["Position"]))
    .style("opacity", "0.9")
    .attr("width", "6px")
    .delay((d, i) => {
      return duration + (i * delay) + 10;
    })
    .duration(duration)
    .ease(d3.easeQuad);
}


function scatter() {
  console.log("==> scatter()");
  title.html("What was the <u>Average Rank</u> in all Qualifications ?");
  attachTooltips();
  var delay = 50;
  var duration = 800;

  mainSVG
    .selectAll("rect.car")
    .transition()
    .attr("y", -130)
    .style("opacity", 0)
    .delay((d, i) => {
      return ((i - 1) * delay);
    })
    .duration(duration)
    .ease(d3.easeQuad);

  mainSVG
    .selectAll("rect.bar")
    .transition()
    .attr("y", -130)
    .attr("height", 0)
    .style("opacity", 0)
    .delay((d, i) => {
      return ((i - 1) * delay + 20);
    })
    .duration(duration)
    .ease(d3.easeQuad);


  setTimeout(() => {
    mainSVG
      .selectAll("#bar")
      .remove();
    mainSVG
      .selectAll("#cars")
      .remove();
  }, duration + 40);

  mainSVG
    .selectAll("text.label")
    .transition()
    // Circle attrs
    .attr("x", "0px")
    .attr("y", (d, i) => yScale(i) + "px")

    .delay((d, i) => {
      return (duration * 1.5) + (i * 50);
    })
    .duration(duration)
    .ease(d3.easeSinInOut);

  // setttimeout to run on the next event loop
  setTimeout(() => {
    mainSVG
      .selectAll("text")
      .classed("x-axis", true);
  }, 2000);

  mainSVG
    .selectAll("#avatar-group circle")
    .transition()
    .attr("cy", (d, i) => yScale(i) - (CONFIG.scatterRadius / 2))
    .attr("cx", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]))
    .attr("r", CONFIG.scatterRadius)
    .delay((d, i) => {
      return ((duration / 2) * 3) + (i * 50);
    })
    .duration(duration)
    .ease(d3.easeSinInOut);


  mainSVG
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init labels
    .selectAll("text")
    .data([5, 6, 7, 8, 9, 10, 11])
    .enter().append("text")
    .classed("x-label", true)

    // bar attrs
    .attr("x", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d))
    .attr("y", (d, i) => height + 25)
    .text(d => d)
    .style("opacity", 0)
    .transition()
    .style("opacity", 1)
    .delay((d) => {
      return duration * 3;
    })
    .duration(duration)
    .ease(d3.easeSinInOut);
}

function dumbell() {
  console.log("==> dumbell()");
  title.html("What was the <u>Average Rank</u> in Qualifications vs <span>Race Results</span>?");

  d3.select(".instruction").text("↓ to restart infographic")
  // lines
  mainSVG
    .append("g")
    .attr("id", "dumbell-line-group")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init lines
    .selectAll("line")
    .data(data)
    .enter().insert("line", "#avatar-group")
    .classed("line", true)

    .attr("x1", (d, i) => {
      var offset = CONFIG.scatterRadius;
      if (d["Qualification Results"] > d["Race Results"]) {
        offset = -offset;
      }
      return (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]) + offset;
    })
    .attr("y1", (d, i) => yScale(i) - (CONFIG.scatterRadius / 2))
    .attr("x2", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]))
    .attr("y2", (d, i) => yScale(i) - (CONFIG.scatterRadius / 2))

    .attr("stroke", "#b89595")
    .attr("stroke-width", 3)



    .transition()
    .attr("x1", (d, i) => {
      var offset = CONFIG.scatterRadius;
      if (d["Qualification Results"] > d["Race Results"]) {
        offset = -offset;
      }
      return (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]) + offset;
    })
    .attr("x2", (d, i) => {
      var offset = CONFIG.scatterRadius;
      if (d["Qualification Results"] < d["Race Results"]) {
        offset = -offset;
      }
      return (CONFIG.margin.left * 2) + xScalePosition(d["Race Results"]) + offset;
    })

    .delay((d, i) => {
      return i * 50;
    })
    .duration(1000)
    .ease(d3.easeBackOut)


  // Circles Group
  mainSVG
    .append("g")
    .attr("id", "dumbell-group")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init Circles
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
    .classed("avatar", true)
    .classed("dumbell", true)
    .attr("pilot", d => getID(d["Pilot"]))

    .attr("cy", (d, i) => yScale(i) - (CONFIG.scatterRadius / 2))
    .attr("cx", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]))
    .attr("r", CONFIG.scatterRadius - 5)
    .attr("fill", "transparent")



    .transition()
    // Circle attrs
    .attr("cx", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d["Race Results"]))
    .attr("fill", "red")
    .delay((d, i) => {
      return i * 50;
    })
    .duration(1000)
    .ease(d3.easeBackOut);

  attachTooltips();
}
