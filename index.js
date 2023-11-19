import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"


async function getData(URL) {
  const response = await fetch(URL);
  const DATA = await response.json();
  
  console.log(DATA);
  
  DATA.forEach(d => d.Timestamp = fix_timestamp(d.Time))
  
  const W = 1000;
  const H = 500;
  const P = 40;
  
  const xDomainMin = d3.min(DATA, d => d.Year) //1994
  const xDomainMax = d3.max(DATA, d => d.Year) //2015
  
  const yDomainMin = d3.min(DATA, d => d.Timestamp) //"36:50" => now stored in ms 2210000
  const yDomainMax = d3.max(DATA, d => d.Timestamp) //"39:50" => now stored in ms 2390000
  
  //console.log(yDomainMin, yDomainMax)
  
  const xScale = d3
    .scaleUtc()
    .domain([make_year_timestamp(xDomainMin - 1), make_year_timestamp(xDomainMax + 1)])
    .range([P, W-P])
  
  
  const yScale = d3
    .scaleUtc()
    .domain([yDomainMin - 5000, yDomainMax])
    .range([P, H-P])
  
  const xAxis = d3.axisBottom(xScale).ticks(10, "%Y")
  const yAxis = d3.axisLeft(yScale).ticks(10, "%M:%S");
  
  
  //console.log(xScale(1994));
  //console.log(xScale(2015));
  
  //console.log(yScale(2210000));
  //console.log(yScale(2390000));    

  function make_year_timestamp(year) {
    const date_str = year + "-01-01"
    return new Date(date_str)
  }
  
  function fix_timestamp(time) {
    //input time as a string HH:SS
    let [min, sec] = time.split(":")
    min *= 1000 * 60
    sec *= 1000
    return min + sec
  }
  
  function handleMouseOver(event) {
    //console.log(event)
    if (event.target.dataset.xvalue) {
      const date = new Date(event.target.dataset.yvalue)
      const time_string = date.getMinutes() + ":" + date.getSeconds();
      document.getElementById("tooltip").style.visibility = "visible";
      document.getElementById("tooltip").innerHTML = `<p>Year: ${event.target.dataset.xvalue}</p>
                                                      <p>Time: ${time_string}</p>
                                                      <p>Doping: ${event.target.dataset.doping}`;
      document.getElementById("tooltip").setAttribute("data-year", event.target.dataset.xvalue);
    }
  }
  
  
  function handleMouseOut() {
    document.getElementById("tooltip").style.visibility = "hidden";
  }
  
  
  const svg = d3
    .select("body")
    .append("svg")
      .attr("id", "svg")
      .attr("height", H)
      .attr("width", W)
    
  svg
    .append("g")
      .attr("transform", `translate(0, ${H-P})`)
      .attr("id", "x-axis")
      .call(xAxis)
  
  svg
    .append("g")
      .attr("transform", `translate(${P}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis)
  
  svg
    .selectAll("circle")
    .data(DATA)
    .enter()
    .append("circle")
      .attr("cx", d => xScale(make_year_timestamp(d.Year)))
      .attr("cy", d => yScale(fix_timestamp(d.Time)))
      .attr("r", "5")
      .attr("class", d => d.Doping === '' ? "dot" : "dot doping")
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => new Date(d.Timestamp))
      .attr("data-doping", d => d.Doping)
      .on("mouseover", e => handleMouseOver(e))
      .on("mouseout", e => handleMouseOut());
  
  d3.select("#vis").append("div")
    .style("visibility", "hidden")
    .attr("id", "tooltip")
    .text("ohi")  

}




  

  



getData(URL);
