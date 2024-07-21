d3.dsv(',', 'Electric_Vehicle_Population_Data.csv', function(d) {
    return { county: d.County, vehicleType: d["Electric Vehicle Type"] };
}).then(function(data) {
    data = data.slice(0, 1000);

    const countsArray = [];
    const countyVehicleCounts = {};
    const totalVehicleCounts = {};

    data.forEach(function(d) {
        const key = `${d.county}_${d.vehicleType}`;
        countyVehicleCounts[key] = (countyVehicleCounts[key] || 0) + 1;

        if (!countsArray.find(item => item.key === key)) {
            countsArray.push({ key, county: d.county, vehicleType: d.vehicleType });
        }

        totalVehicleCounts[d.county] = (totalVehicleCounts[d.county] || 0) + 1;
    });

    const svg = d3.select("body").append("svg")
        .attr("width", 1200)
        .attr("height", 600);

    const xScale = d3.scaleBand()
        .domain(countsArray.map(d => d.county))
        .range([120, 1200])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(countsArray, d => countyVehicleCounts[d.key])])
        .range([600, 0]);

    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(100));

    svg.selectAll("rect.main-counts")
        .data(countsArray)
        .enter().append("rect")
        .attr("x", d => xScale(d.county))
        .attr("y", d => yScale(countyVehicleCounts[d.key]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => 600 - yScale(countyVehicleCounts[d.key]))
        .attr("fill", "steelblue")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    svg.selectAll("rect.electric-vehicle-type")
});
