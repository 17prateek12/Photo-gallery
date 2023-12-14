import React, { useContext } from "react";
import NightlightTwoToneIcon from '@mui/icons-material/NightlightTwoTone';
import ThemeContext from "../Context/ThemeContext";
import { Avatar } from "@mui/material";


const ThemeIcon = () => {
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    const toggleDarkMode = () => {
        console.log("Toggling dark mode");
        setDarkMode(!darkMode);
    };

    const buttonStyle = {
        borderRadius: "50%",
        border: "1px solid #ccc",
        padding: "8px",
        position: "absolute",
        right: "8px",
        xlRight: "32px",
        boxShadow: darkMode ? "0 0 5px #888" : "none",
    };

    const moonIconStyle = {
        height: "40px",
        width: "40px",
        cursor: "pointer",
        strokeWidth: "1",
    };

    if (darkMode) {
        moonIconStyle.fill = "#FFD700";
        moonIconStyle.stroke = "#FFD700";
    }

    return (

        <Avatar
            style={buttonStyle}
            onClick={toggleDarkMode}
        >
            <NightlightTwoToneIcon sx={{ color: 'black', height: '100%', width: '100%' }} style={moonIconStyle} />
        </Avatar>

    );
};

export default ThemeIcon;
