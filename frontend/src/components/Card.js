import { useState, useEffect } from "react";
import React from "react";

import axios from "axios";



const Card = ({ label, icon, statistic }) => {


  const cardStyles = {
    width: "500px",
    height: "400px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",

    overflow: "hidden",
    padding: "10px",
  };

  const labelSectionStyles = {
    height: "50%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f1f1f1",
  };

  const iconStyles = {
    width: "60",
    height: "100px",
  };

  const spanStyles = {
    fontFamily:
      '"Avant Garde", Avantgarde, "Century Gothic", CenturyGothic, "AppleGothic", sans-serif',
    fontSize: "20px",
    padding: "15px 10px",
    textAlign: "center",
    textTransform: "uppercase",
    textRendering: "optimizeLegibility",
    color: "#e0dfdc",
    backgroundColor: "#333",
    letterSpacing: ".1em",
    textShadow: `
    0 -1px 0 #fff, 
    0 1px 0 #2e2e2e, 
    0 2px 0 #2c2c2c, 
    0 3px 0 #2a2a2a, 
    0 4px 0 #282828, 
    0 5px 0 #262626, 
    0 6px 0 #242424, 
    0 7px 0 #222, 
    0 8px 0 #202020, 
    0 9px 0 #1e1e1e, 
    0 10px 0 #1c1c1c, 
    0 11px 0 #1a1a1a, 
    0 12px 0 #181818, 
    0 13px 0 #161616, 
    0 14px 0 #141414, 
    0 15px 0 #121212, 
    0 22px 30px rgba(0, 0, 0, 0.9)
  `,
  };

  const statSectionStyles = {
    height: "75%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "80px",
    fontWeight: "bold",
  };
  return (
    <div className="actualCard" style={cardStyles}>
      <div className="labelNicon" style={labelSectionStyles}>
        <span className="justLabel" style={spanStyles}>{label}</span>
        <div className="icon" style={iconStyles}>
          { icon}
        </div>
      </div>
      <div style={statSectionStyles}>{statistic} </div>
    </div>
  );
};

export default Card;
