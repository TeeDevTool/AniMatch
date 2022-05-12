// external module
import React, { useState, useEffect } from "react";

// internal module
import Home from "./components/Home/Home";
import DisplayBubbleInfo from "./components/DisplayBubbleInfo/DisplayBubbleInfo";
import BubbleChart from "./components/BubbleChart/BubbleChart";
import BrushChart from "./components/BrushChart/BrushChart";
import BasicScatterChart from "./components/ScatterChart/ScatterChart";
import { Types } from "./components/BubbleChart/types";
import { colors } from "./assets/palette";

// data
import animeData from "./animate/animeData";
import animeActionData from "./animate/anime_action.json";
import animeAdventureData from "./animate/anime_adventure.json";
import animeComedyData from "./animate/anime_comedy.json";
import animeDramaData from "./animate/anime_drama.json";
import animeScifiData from "./animate/anime_scifi.json";
import animeSliceData from "./animate/anime_sliceoflife.json";

// css
import "./App.css";

function App() {
    const initial = { name: "", genre: "", rating: "", choose: false };
    const dAll = animeData as Types.Data[];
    const dAction = animeActionData as Types.Data[];
    const dAdventure = animeAdventureData as Types.Data[];
    const dComedy = animeComedyData as Types.Data[];
    const dDrama = animeDramaData as Types.Data[];
    const dScifi = animeScifiData as Types.Data[];
    const dSlice = animeSliceData as Types.Data[];

    const [state, setState] = useState({
        data: dAll,
        display: initial,
        width: 0,
        height: 0,
        genre: 0,
        dataSet: [dAll, dAction, dAdventure, dComedy, dDrama, dScifi, dSlice],
        genreMap: [
            { index: 0, genre: "All" },
            { index: 1, genre: "Action" },
            { index: 2, genre: "Adventure" },
            { index: 3, genre: "Comedy" },
            { index: 4, genre: "Drama" },
            { index: 5, genre: "Sci-Fi" },
            { index: 6, genre: "Slice of Life" },
        ],
    });

    useEffect(() => {
        window.addEventListener("scroll", listenToScroll);

        return () => window.removeEventListener("scroll", listenToScroll);
    }, []);

    const listenToScroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        setState((prevState) => ({ ...prevState, height: winScroll }));
    };

    const selectedKeyHandler = (data: any) => {
        const { name, genre, rating } = data;
        setState((prevState) => ({
            ...prevState,
            display: {
                name: name,
                genre: genre,
                rating: rating,
                choose: true,
            },
        }));
    };

    const handleSelect = (e: any) => {
        let val = e?.target?.value;
        setState((prevState) => ({ ...prevState, genre: val, data: prevState.dataSet[val] }));
    };

    const onReset = () => {
        setState((prevState) => ({ ...prevState, display: initial }));
    };

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const updateDimensions = () => {
        const _width = window.innerWidth;
        setState((prevState) => ({ ...prevState, width: _width }));
    };

    return (
        <div className="App">
            <Home />
            <div className="flex-display bubbleLayout">
                <BubbleChart
                    bubblesData={state.data?.map((d) => ({
                        name: d.name,
                        genre: d.genre,
                        rating: d.rating,
                        members: d.members,
                    }))}
                    genre={state.genre}
                    width={state.width * 0.775}
                    height={window.innerHeight}
                    backgroundColor="#f1faee"
                    minValue={1}
                    maxValue={130}
                    heightShow={state.height}
                    selectedCircle={selectedKeyHandler}
                    onReset={onReset}
                />
                <DisplayBubbleInfo
                    {...{
                        ...state.display,
                        height: state.height,
                        genres: state.genre,
                        genreList: state.genreMap,
                        handleChange: handleSelect,
                    }}
                />
            </div>
            <BrushChart height={state.height} />
            <BasicScatterChart
                width={800}
                height={400}
                top={10}
                right={50}
                bottom={50}
                left={50}
                fill={colors.color1}
                heightShow={state.height}
            />
        </div>
    );
}

export default App;
