// external module
import { useEffect, useState, memo } from "react";
import { Grid, MenuItem, Select, FormControl } from "@material-ui/core";

// internal module
import { text2, text3 } from "../../assets/text";

const Introduction = (props) => {
    return (
        <div className="bubble">
            <div className="intro">{text2}</div>
            <div className="intro">{text3}</div>
        </div>
    );
};

const Info = (props) => {
    return (
        <div className="animeInfo">
            <h1>Anime Information</h1>
            {props.choose ? (
                <>
                    <Grid container>
                        <Grid item sm={4}>
                            <h4>{`Anime Name:`}</h4>
                        </Grid>
                        <Grid item sm={8}>
                            <h4>{props.name}</h4>
                        </Grid>
                        <Grid item sm={4}>
                            <h4>{`Genre:`}</h4>
                        </Grid>
                        <Grid item sm={8}>
                            <h4>{props.genre}</h4>
                        </Grid>
                        <Grid item sm={4}>
                            <h4>{`Rating:`}</h4>
                        </Grid>
                        <Grid item sm={8}>
                            <h4>{props.rating}</h4>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <h2>Click bubble to display</h2>
            )}
        </div>
    );
};

const DisplayBubbleInfo = memo((props) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let heightToHideFrom = 40;
        let timer = null;

        if (props.height < heightToHideFrom) {
            // do nothing
        } else {
            timer = setTimeout(() => setIsVisible(true), 600);
        }
    }, [props.height]);

    return isVisible ? (
        <div className="display animated fadeInRight">
            <FormControl style={{ minWidth: 160 }}>
                <h6>Genre</h6>
                <Select
                    label="Genre"
                    labelId="genre-label"
                    className="selector"
                    id="genre-selector"
                    value={props?.genre}
                    onChange={props?.handleChange}
                >
                    {props.genreList.map((g) => (
                        <MenuItem value={g.index}>{g.genre}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Introduction />
            <Info {...props} />
        </div>
    ) : null;
});

export default DisplayBubbleInfo;
