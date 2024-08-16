import React from "react";
import * as d3 from "d3";

export default class CollectionParcelReport extends React.Component {
  constructor() {
    super();
    this.state = { collectionParceldetails: [], error: null };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  async loadData() {
    const query = `
      query {
        collectionParcelList {
          id
          ParcelStatus
        }
      }
    `;
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      this.setState({ collectionParceldetails: result.data.collectionParcelList });
    } catch (error) {
      console.error('Error loading data:', error);
      this.setState({ error: 'Failed to load parcel data' });
    }
  }

  drawChart() {
    const data = this.state.collectionParceldetails;

    // Group data by ParcelStatus
    const statusCounts = d3.rollups(
      data,
      v => v.length,
      d => d.ParcelStatus
    );

    // Remove the existing chart if it exists
    d3.select("#pieChart").select("svg").remove();

    // Set the dimensions and margins of the graph
    const width = 600;
    const height = 400;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;

    // Append the svg object to the div called 'pieChart'
    const svg = d3
      .select("#pieChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2 - margin},${height / 2})`);

    // Set the color scale
    const color = d3.scaleOrdinal()
      .domain(statusCounts.map(d => d[0]))
      .range(d3.schemeCategory10);

    // Compute the position of each group on the pie
    const pie = d3.pie()
      .value(d => d[1]);

    const data_ready = pie(statusCounts);

    // Build the pie chart
    svg
      .selectAll('whatever')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Add labels to the pie slices
    svg
      .selectAll('whatever')
      .data(data_ready)
      .join('text')
      .text(d => d.data[0])
      .attr("transform", d => `translate(${d3.arc().innerRadius(0).outerRadius(radius).centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 14);

    // Adjust legend positioning
    const legend = svg
      .append("g")
      .attr("transform", `translate(${radius + 30},${-radius})`)
      .selectAll(".legend")
      .data(statusCounts)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", d => color(d[0]));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .style("font-size", 12)
      .text(d => d[0]);
  }

  render() {
    return (
      <div>
        <h1>Parcel Status Distribution</h1>
        <div id="pieChart" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}></div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}
