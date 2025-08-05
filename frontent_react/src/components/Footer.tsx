import React from "react";
import "./footer.css"; // Ensure you have the correct CSS file
import Footercard from "./Footercard";
export function Footer() {
  return (
    <>
    <Footercard/>
   
    <footer className="new_footer_area">
      <div className="new_footer_top">
        <div className="footer_bg">
          <div className="footer_bg_one"></div>
          <div className="footer_bg_two"></div>
          <div className="footer_bg_three"></div>
        </div>
      </div>
    </footer>
    </>
  );
}