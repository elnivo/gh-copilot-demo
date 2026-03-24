// generate a plot with D3.js of the selling price of the album by year
// x-axis are the month series and y-axis show the numbers of albums sold
// data from the sales of album are loaded in from an external source and are in json format
import d3 from 'd3';

export function createAlbumSalesPlot(data: { month: string; albumsSold: number }[]) {
  // Set the dimensions and margins of the graph
  const margin = { top: 20, right: 30, bottom: 40, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append the svg object to the body of the page
  const svg = d3
    .select('#album-sales-plot')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // X axis
  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, width])
    .padding(0.1);
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.albumsSold)!])
    .nice()
    .range([height, 0]);
  svg.append('g')
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.month)!)
    .attr('y', d => y(d.albumsSold))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.albumsSold));
}
