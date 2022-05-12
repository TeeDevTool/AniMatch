// external module
import { useEffect, useState } from "react";
import { Tooltip } from "@material-ui/core";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// internal module
import { capitalize } from "../../utils/util";
import { text1 } from "../../assets/text";

const SlideShow = (props) => {
    const animeList = ["gintama", "fate zero", "one punch man", "kobayashisan chi no maid dragon", "haikyuu"];
    const carousalProps = {
        autoPlay: true,
        infiniteLoop: true,
        showThumbs: false,
        showStatus: false,
        showArrows: false,
        interval: 6000,
    };

    const renderAnime = (anime) => {
        return (
            <div key={anime + "poster"}>
                <img src={`/poster/${anime.split(" ").join("")}-poster.jpg`} />
                <p className="legend">{capitalize(anime)}</p>
            </div>
        );
    };

    return <Carousel {...carousalProps}>{animeList.map(renderAnime)}</Carousel>;
};

const Title = ({ title }) => {
    let firstChar = capitalize(title).charAt(0);
    let other = title.slice(1);

    return (
        <>
            <h1>{firstChar}</h1>
            <h2>{other}</h2>
        </>
    );
};

const Home = () => {
    const [fadeIn, setFade] = useState(false);
    const stackSet = ["javascript", "react", "d3", "material-ui"];
    let height = 90;
    let width = 90;

    useEffect(() => {
        let aText = new Array(...text1);
        let iSpeed = 35; // time delay of print out
        let iIndex = 0; // start printing array at this posision
        let iArrLength = aText[0].length; // the length of the text array
        let iScrollAt = 20; // start scrolling up at this many lines

        let iTextPos = 0; // initialise text position
        let sContents = ""; // initialise contents variable
        let iRow; // initialise current row

        function typewriter() {
            sContents = " ";
            iRow = Math.max(0, iIndex - iScrollAt);
            let destination = document.getElementById("typedtext");

            while (iRow < iIndex) {
                sContents += aText[iRow++] + "<br />";
            }
            destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
            if (iTextPos++ == iArrLength) {
                iTextPos = 0;
                iIndex++;
                if (iIndex != aText.length) {
                    iArrLength = aText[iIndex].length;
                    setTimeout(() => typewriter(), 100);
                }
            } else {
                setTimeout(() => typewriter(), iSpeed);
            }
        }

        typewriter();
    }, []);

    const renderImage = (stacks) => {
        return (
            <Tooltip key={stacks + "img"} placement="top" title={capitalize(stacks)}>
                <img src={`/icons/${stacks}-icon.png`} alt={`${stacks}-icon`} width={width} height={height} />
            </Tooltip>
        );
    };

    return (
        <div className="home-layout">
            <div className="introduction animated fadeInLeft">
                <div className="flex-display">
                    <Title title="AniMatch" />
                </div>
                <h4 id="typedtext" />
                <div className="stack">
                    <div className="stack-layout">{stackSet.map(renderImage)}</div>
                </div>
            </div>
            <div className="flex-display animated fadeInRight">
                <div className="anime">
                    <SlideShow />
                </div>
            </div>
        </div>
    );
};

export default Home;
