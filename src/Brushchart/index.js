import React { useRef, useEffect} from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  axisBottom,
  axisLeft,
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a BrushChart
 */

function BrushChart({data}) {
 const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef)

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = dimension || wrapperRef.current.getBoundingClientRect();

    // scales = Line generator
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width])

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height, 0])

    const lineGenerator = line()
      .x( (d, index) => xScale(index))
      .y(d => yScale(d))
      .curve(curveCardinal);

    // render new line
    svg
      .selectAll(".my-line")
      .data([data])
      .join("path")
      .attr("class", "my-line")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", listGenerator);

    svg
      .selectAll(".my-dot")
      .data(data)
      .join("circle")
      .attr("class", "my-dot")
      .attr("stroke", "black")
      .attr("r", 2)
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", yScale)

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(.x-axis)
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);
  }, [data, dimensions])

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{marginBottom: "2rem"}}>
        <svg ref={svgRef}>
          <g className="x-axis"/>
          <g className="y-axis"/>
        </svg>
      </div>
    </React.Fragment>
  )
}

export default BrushChart;
