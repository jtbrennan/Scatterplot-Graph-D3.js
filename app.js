// Fetch the data
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(data => {
  // Set up dimensions
  const width = 800;
  const height = 500;
  const padding = 40;

  // Create SVG
  const svg = d3.select('#scatterplot')
    .attr('width', width + 2 * padding)
    .attr('height', height + 2 * padding);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
    .range([padding, width + padding]);

  const yScale = d3.scaleTime()
    .domain([d3.min(data, d => new Date(d.Seconds * 1000)), d3.max(data, d => new Date(d.Seconds * 1000))])
    .range([height + padding, padding]);

  // Create axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height + padding})`)
    .call(xAxis);

  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

  // Create dots
  svg.selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => new Date(d.Seconds * 1000))
    .attr('cx', d => xScale(d.Year))
    .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
    .attr('r', 6)
    .style('fill', d => d.Doping ? 'red' : 'green')
    .on('mouseover', (event, d) => {
      d3.select('#tooltip')
        .attr('data-year', d.Year)
        .style('opacity', 0.9)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY + 'px')
        .html(`
          ${d.Name}: ${d.Nationality}<br>
          Year: ${d.Year}<br>
          Time: ${d.Time}<br>
          ${d.Doping ? d.Doping : 'No doping allegations'}
        `);
    })
    .on('mouseout', () => {
      d3.select('#tooltip').style('opacity', 0);
    });
});
