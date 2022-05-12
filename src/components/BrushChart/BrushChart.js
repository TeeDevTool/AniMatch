// external module
import React, { useRef, useEffect, useState } from "react";
import { Fade, Table } from "@material-ui/core";
import { select, scaleLinear, brushX } from "d3";
import * as d3 from "d3";
import RawTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// internal module
import useResizeObserver from "./useResizeObserver";
import usePrevious from "./usePrevious";
import { colors } from "../../assets/palette";
import { text4 } from "../../assets/text";

// data
import yearInfo from "./year_info-2.json";
import animeData from "./anime_selected-2.json";

function ListTable(props) {
    const renderTable = (row) => (
        <TableRow style={{ paddingTop: 0, paddingBottom: 0 }} key={row.Name}>
            <TableCell component="th" scope="row">
                {row.Name}
            </TableCell>
            <TableCell align="right">{row.Studios}</TableCell>
            <TableCell align="right">{row.Score}</TableCell>
        </TableRow>
    );

    return (
        <>
            {props.lists.length !== 0 ? (
                <TableContainer id="tableList">
                    <RawTable>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Studio</TableCell>
                                <TableCell align="right">Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{props.lists.map(renderTable)}</TableBody>
                    </RawTable>
                </TableContainer>
            ) : null}
        </>
    );
}

function BrushChart(props) {
    const barSVG = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const { _width, _height } = dimensions ??
        wrapperRef.current?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight };

    const [state, setState] = useState({
        selection: [0, 0],
        filterValue: [],
        data: [],
        listYear: [],
        isVisible: false,
    });

    const previousSelection = usePrevious(state.selection);
    const initialFilterValue = [];

    useEffect(() => {
        setState((prevState) => ({ ...prevState, data: yearInfo }));
    }, []);

    useEffect(() => {
        let heightToHideFrom = window.innerHeight;
        let timer = null;

        if (props.height < heightToHideFrom) {
            // do nothing
        } else {
            timer = setTimeout(() => setState((prevState) => ({ ...prevState, isVisible: true })), 200);
        }
    }, [props.height]);

    useEffect(() => {
        if (state.data) {
            const length = state.data.length;
            const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
            const xScale = scaleLinear().range([0, width * 0.5]);

            var svg = select(barSVG.current);

            var x = d3
                .scaleBand()
                .domain(
                    state.data.map(function (d) {
                        return d.Year;
                    })
                )
                .range([0, width * 0.5])
                .padding(0.2);

            svg.append("g")
                .attr("class", "customAxis")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("class", "y-text")
                .attr("fill", colors.color5)
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            // Add Y axis
            var y = d3.scaleLinear().domain([0, height]).range([height, 0]);
            svg.append("g").attr("class", "customAxis").call(d3.axisLeft(y));

            // Bars
            svg.selectAll("mybar")
                .data(state.data)
                .enter()
                .append("rect")
                .attr("width", x.bandwidth())
                .attr("fill", colors.color4)
                .style("opacity", 0.9)
                .attr("height", function (d) {
                    return height - y(0);
                }) // always equal to 0
                .attr("y", function (d) {
                    return y(0);
                })
                .attr("x", function (d) {
                    return x(d.Year);
                });

            // Animation
            svg.selectAll("rect")
                .transition()
                .duration(500)
                .attr("y", function (d) {
                    return y(d.n);
                })
                .attr("height", function (d) {
                    return height - y(d.n);
                })
                .delay(function (d, i) {
                    return i * 100;
                });
            // brush

            const brush = brushX().extent([
                [0, 0],
                [width * 0.5, height],
            ]);

            brush.on("start brush end", (event) => {
                if (event.selection) {
                    const indexSelection = event.selection.map(xScale.invert);
                    const range = indexSelection.map((num) => num * length);
                    setState((prevState) => ({ ...prevState, selection: range }));
                }
            });

            // initial position + retaining position on resize
            if (previousSelection === state.selection) {
                svg.select(".brush").call(brush).call(brush.move, state.selection.map(x));
            }
        }
    }, [state.data]);

    useEffect(() => {
        findItem();
    }, [state.selection]);

    function findItem() {
        setState((prevState) => ({ ...prevState, filterValue: initialFilterValue }));

        let listYear = state.data.filter((value, index) => index >= state.selection[0] && index <= state.selection[1]);
        let output = [];

        setState((prevState) => ({ ...prevState, listYear }));

        for (let i in listYear) {
            output = [...animeData.filter((anime) => anime.Year === listYear[i].Year).slice(0, 10), ...output];
        }

        setState((prevState) => ({ ...prevState, filterValue: output }));
    }

    return (
        <>
            <div className="flex-display brush">
                {state.isVisible ? (
                    <>
                        <div>
                            <div className="bubble animated fadeInUp">{text4}</div>
                            <ListTable lists={state.filterValue} />
                        </div>
                    </>
                ) : null}
                <Fade in={state.isVisible} {...(state.isVisible ? { timeout: 1000 } : {})}>
                    <div ref={wrapperRef} style={{ marginBottom: "2rem", width: "100%", textAlign: "end" }}>
                        <svg ref={barSVG} style={{ width: "80%", height: "500px" }}>
                            <g className="x-axis" />
                            <g className="y-axis" />
                            <g className="brush" />
                        </svg>
                    </div>
                </Fade>
            </div>
        </>
    );
}

export default BrushChart;
