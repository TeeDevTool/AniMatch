// external module
import React from "react";
import * as d3 from "d3";
import { Simulation, SimulationNodeDatum } from "d3-force";

// internal module
import { Types } from "./types";
import { pastel, colors } from "../../assets/palette";

// css
import "./BubbleChart.css";

class BubbleChart extends React.Component<IBubbleChartProps, IBubbleChartState> {
    public forceData: Types.ForceData[];
    public prev: number;

    private simulation: Simulation<SimulationNodeDatum, undefined> | undefined;

    constructor(props: IBubbleChartProps) {
        super(props);

        this.state = {
            data: [],
            show: false,
            height: window.scrollY,
        };

        this.forceData = this.setForceData(props);
        this.prev = window.scrollY;
    }

    componentDidMount() {
        this.animateBubbles();
    }

    componentDidUpdate(prevProps: IBubbleChartProps, prevState: IBubbleChartState) {
        if (JSON.stringify(prevProps.bubblesData) !== JSON.stringify(this.props.bubblesData)) {
            this.forceData = this.setForceData(this.props);
            this.animateBubbles();
        }

        if (prevProps.heightShow !== this.props.heightShow) {
            let heightToHideFrom = 40;

            if (this.props.heightShow > heightToHideFrom) {
                // do nothing
            } else {
                this.setState({ show: true });
            }
        }

        if (prevState.show !== this.state.show) {
            this.animateBubbles();
        }
    }

    setForceData = (props: IBubbleChartProps) => {
        const d = [];
        for (let i = 0; i < props.bubblesData.length; i++) {
            let largeSet = [1];
            let mediumSet = [3, 6];
            let specificThreshold = largeSet.includes(this.props.genre)
                ? 0.0001
                : mediumSet.includes(this.props.genre)
                ? 0.0002
                : 0.0003;

            d.push({ size: props.bubblesData[i].members * specificThreshold });
        }
        return d;
    };

    animateBubbles = () => {
        if (this.props.bubblesData.length > 0) {
            this.simulatePositions(this.forceData);
        }
    };

    radiusScale = (value: d3.NumberValue) => {
        const fx = d3.scaleSqrt().range([30, 60]).domain([this.props.minValue, this.props.maxValue]);
        return fx(value);
    };

    simulatePositions = (data: Types.ForceData[]) => {
        const simulation = d3
            .forceSimulation()
            .nodes(data as SimulationNodeDatum[])
            .velocityDecay(0.6)
            .force("x", d3.forceX().strength(0.1))
            .force("y", d3.forceY().strength(0.2))
            .force(
                "collide",
                d3.forceCollide((d: SimulationNodeDatum) => {
                    return this.radiusScale((d as Types.ForceData).size) + 2;
                })
            )
            .on("tick", () => {
                this.setState({ data });
            });
    };

    renderBubbles = (data: []) => {
        return data.map((item: { v: number; x: number; y: number; size: number }, index) => {
            const { props } = this;
            const radius = this.radiusScale((item as unknown as Types.ForceData).size);
            const fontSize = radius / 4;
            const content = props.bubblesData.length > index ? props.bubblesData[index].name : "";
            let colorThreshold = Math.floor(index / pastel.length);
            let randColor = index < pastel.length ? pastel[index] : pastel[index - pastel.length * colorThreshold];
            const strokeColor = `${randColor}`;
            const x = props.width / 2 + item.x - 70;
            const y = props.height / 2 + item.y;
            let yPos = content.length < 15 ? 5 : content.length < 32 ? 3.5 : 2;

            return (
                <g
                    key={`g-${index}`}
                    style={{ cursor: "pointer" }}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => {
                        this.props.selectedCircle(props.bubblesData[index]);
                    }}
                >
                    <circle
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            this.props.selectedCircle(props.bubblesData[index]);
                        }}
                        id="circleSvg"
                        r={radius}
                        fill={strokeColor}
                        stroke={strokeColor}
                        strokeWidth="2"
                    />
                    <foreignObject x={-radius} y={-radius / yPos} width={radius * 2} height={radius * 1.2}>
                        <div
                            style={{ color: colors.color5, fontSize: `${fontSize}px` }}
                            onClick={() => {
                                this.props.selectedCircle(props.bubblesData[index]);
                            }}
                        >
                            {content}
                        </div>
                    </foreignObject>
                </g>
            );
        });
    };

    render() {
        if (this.state.show) {
            return (
                <div>
                    <div aria-hidden="true" id="chart" className="animated fadeInLeft">
                        <svg width={this.props.width} height={this.props.height}>
                            {this.renderBubbles(this.state.data as [])}
                        </svg>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

interface IBubbleChartProps {
    bubblesData: Types.Data[];
    width: number;
    height: number;
    backgroundColor: string;
    minValue: number;
    maxValue: number;
    genre: number;
    heightShow: number;
    selectedCircle: (content: any) => void;
    onReset: () => void;
}

interface IBubbleChartState {
    data: Types.ForceData[];
    height: number;
    show: boolean;
}

export default BubbleChart;
