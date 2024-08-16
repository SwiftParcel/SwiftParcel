import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './footer.css';
import fb from '../Images/facebook.png';
import twitter from '../Images/twitter.png';
import insta from '../Images/instagram.png';
import linkedin from '../Images/linkedin.png';
import logo from '../Images/logo-white-tr.png';


const Footer = () => {
    return (
        <div className="footer">
            <div className="sb_footer section_padding">
                <div className="sb_footer-links">
                    <div className="sb_footer-links-div">
                        <h4>For Business</h4>
                        <a href="/employer">
                            <p>Employer</p>
                        </a>
                        <a href="/healthplan">
                            <p>Health Plan</p>
                        </a>
                        <a href="/induvidual">
                            <p>Induvidual</p>
                        </a>
                    </div>
                    <div className="sb_footer-links-div">
                        <h4>Resorces</h4>
                        <a href="/employer">
                            <p>Employer</p>
                        </a>
                        <a href="/healthplan">
                            <p>Health Plan</p>
                        </a>
                        <a href="/induvidual">
                            <p>Induvidual</p>
                        </a>
                    </div>
                    <div className="sb_footer-links-div">
                        <h4>Logins</h4>
                        <Link to="/adminDash">
                            <p>Admin</p>
                        </Link>
                        <Link to="/collectionDash">
                            <p>Collection Center</p>
                        </Link>
                        <Link to="/hubDash">
                            <p>Hub</p>
                        </Link>
                    </div>
                    <div className="sb_footer-links-div">
                        <h4>For Business</h4>
                        <a href="/employer">
                            <p>Employer</p>
                        </a>
                    </div>
                    <div className="sb_footer-links-div">
                        <h4>Company</h4>
                        <a href="/aboutus">
                            <p>About Us</p>
                        </a>
                        <a href="/contact">
                            <p>Contact us</p>
                        </a>
                        <a href="/Career">
                            <p>Career</p>
                        </a>
                    </div>
                    <div className="sb_footer-links_div">
                        <h4>Coming soon on</h4>
                        <div className="socialmedia">
                            <p><img src={fb} alt="" /></p>
                            <p><img src={twitter} alt="" /></p>
                            <p><img src={linkedin} alt="" /></p>
                            <p><img src={insta} alt="" /></p>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="sb_footer-below">
                    <div className="sb_footer-copyright">
                        <p>
                            @{new Date().getFullYear()} Swift Parcels. All right reserved.
                        </p>
                        <br></br>
                        <img src={logo}></img>
                    </div>
                    <div className="sb_footer-below-links">
                        <a href="/terms"><div><p>Terms & Conditions</p></div></a>
                        <a href="/privacy"><div><p>Privacy</p></div></a>
                        <a href="/security"><div><p>Security</p></div></a>
                        <a href="/cookie"><div><p>Cookie Declaration</p></div></a>
                    </div>
                    I
                </div>
            </div>
        </div>
    )
}
export default Footer;