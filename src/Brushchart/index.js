import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  axisBottom,
  axisLeft,
  brushX
} from "d3";
import useResizeObserver from "../ResizeObserver";
import usePrevious from "../usePrevious";

/**
 * Component that renders a BrushChart
 */

function BrushChart({data}) {
 const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selection, setSelection] = useState([0, 1.5]);
  const previousSelection = usePrevious(selection);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

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
      .attr("d", lineGenerator);

    svg
      .selectAll(".my-dot")
      .data(data)
      .join("circle")
      .attr("class", "my-dot")
      .attr("stroke", "black")
      .attr("r", (value, index) => 
        index >= selection[0] && index <= selection[1] ? 4 : 2
      )
      .attr("fill", (value, index) => 
        index >= selection[0] && index <= selection[1] ? "orange" : "black"
      )
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", yScale)

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);

    // brush
    const brush = brushX()
      .extent([
        [0, 0], 
        [width, height]
      ])
      .on("start brush end", (event) => {
        if (event.selection) {
          const indexSelection = event.selection.map(xScale.invert);
          setSelection(indexSelection)
        }
      });

    if (previousSelection === selection) {
      svg
        .select(".brush")
        .call(brush)
        .call(brush.move, selection.map(xScale))
    }

  }, [data, dimensions, previousSelection, selection])

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{marginBottom: "2rem"}}>
        <svg ref={svgRef}>
          <g className="x-axis"/>
          <g className="y-axis"/>
          <g className="brush"/>
        </svg>
      </div>
      <small style={{ marginBottom: "1rem" }}>Selected values: [
        {
          data
            .filter(
              (value, index) => index >= selection[0] && index <= selection[1]
            )
            .join(",")
        }
      ]</small>
    </React.Fragment>
  )
}

export default BrushChart;
