// external module
import React, { useState, useEffect } from "react";
import * as d3 from "d3";

// internal module
import { Types } from "./types";
import { text5 } from "../../assets/text";

// css
import "./ScatterChart.scss";
import { Fade } from "@material-ui/core";

const BasicScatterChart = (props: IBasicScatterChartProps) => {
    const render = React.useRef(false);
    const [state, setState] = useState(false);

    useEffect(() => {
        if (!render.current) draw();
    }, [render]);

    useEffect(() => {
        let heightToHideFrom = window.innerHeight * 1.7;
        let timer = null;

        if (props.heightShow < heightToHideFrom) {
            // do nothing
        } else {
            timer = setTimeout(() => setState(true), 200);
        }
    }, [props.heightShow]);

    const draw = () => {
        const width = props.width - props.left - props.right;
        const height = props.height - props.top - props.bottom;

        const svg = d3
            .select(".basicScatterChart")
            .append("svg")
            .attr("width", width + props.left + props.right)
            .attr("height", height + props.top + props.bottom)
            .append("g")
            .attr("transform", `translate(${props.left},${props.top})`);

        d3.dsv(",", "/Data/anime_scatter_plot.csv", (d) => {
            return {
                popu: d.Popularity,
                score: d.Score,
            };
        }).then((data) => {
            const maxPop = Math.max(...data.map((dt) => (dt as unknown as Types.Data).popu), 0);
            const maxScore = Math.max(...data.map((dt) => (dt as unknown as Types.Data).score), 0);

            const x = d3.scaleLinear().domain([0, maxPop]).range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .attr("class", "customAxis");

            const y = d3.scaleLinear().domain([0, maxScore]).range([height, 0]);
            svg.append("g").call(d3.axisLeft(y)).attr("class", "customAxis");

            svg.append("g")
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", (d) => {
                    return x((d as unknown as Types.Data).popu);
                })
                .attr("cy", (d) => {
                    return y((d as unknown as Types.Data).score);
                })
                .attr("r", 3)
                .style("fill", props.fill)
                .style("opacity", 0.5)
                .on("mouseover", () => console.log("test")); // สำหรับเพิ่ม hover function
        });
        render.current = true;
    };

    return (
        <div className="scatterChart">
            <div className="flex-display">
                <Fade in={state}>
                    <div className="basicScatterChart" />
                </Fade>
                {state ? <div className="bubble animated fadeInUp">{text5}</div> : null}
            </div>
        </div>
    );
};

interface IBasicScatterChartProps {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    fill: string;
    heightShow: number;
}

export default BasicScatterChart;
