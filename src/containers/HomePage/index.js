/**
 * HomePage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { Component } from 'react';
import './home.scss';
import "react-multi-carousel/lib/styles.css";
import { NavLink } from 'react-router-dom';
import twitterIcon  from '../../assets/images/home/Twitter.svg';
import medium from '../../assets/images/home/Medium.svg';
import reddit from '../../assets/images/home/Reddit.svg';
import facebook from '../../assets/images/home/Facebook.svg';
import instagram from '../../assets/images/home/Instagram.svg';
import linkdin from '../../assets/images/home/Linkdin.svg';
import logo from '../../assets/images/show_token.png';
import phoneImage from '../../assets/images/home/phone-image.png';
import penguin from '../../assets/images/image-01.png';
import arro from '../../assets/images/home/arro.png';


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    
  }


  render() {
    return (
      <React.Fragment>
      <div className="home-wrapper">
         <div className="landing-warp">
            <div className="hero-section">
               <div className="container">
                  <div className="header">
                        <a href="#" className="logo-home"><img className="logo-img" src={logo} alt="logo" /></a>
                  </div>
                  <div className="hero-cell">
                     <div className="row">
                        <div className="col-md-8">
                           <div className="hero-content">
                              <h2 className="hero-slogan">
                                 The Best NFT Marketplace<br />On Binance Smart Chain
                              </h2>
                              <div className="hero-btns">
                                 <NavLink to="/home" className="btn primary-btn">Launch App</NavLink>
                                 <NavLink to="/farmindex" className="btn primary-btn">Read the Docs</NavLink>
                                 <NavLink to="/farmindex" className="btn primary-btn">Forum</NavLink>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-4">
                           <div className="penguin-content">
                              <img src={penguin} alt="penguin" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="mission-section">
               <div className="container">
                  <div className="mission-point">
                    </div>
               </div>
            </div>

            <div className="phone-section">
               <div className="container">
                  <div className="phone-point">
                     <div className="row">
                        <div className="col-md-6 col-sm-6 phone-image">
                           <img src={phoneImage} alt="" />
                        </div>
                        <div className="col-md-6  col-sm-6">
                           <h2 className="phone-slogan">
                              Now every assets can be on blockchain
                           </h2>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="about-section">
               <div className="container">
                  <div className="question-cell">
                     <h3>FAQ</h3>
                  <div className="arror-img">
                     <img src={arro} alt="" />
                  </div>
                     <div className="question-list">
                       
                     </div>
                  </div>
                  <div className="join-cell about-cell">
                     <h3>Join our community</h3>
                     <p>
                        Learn more about XANSHOW, interact with the XANSHOW team, engage in
                        community discussions, and have your say in shaping the future of
                        decentralized finance.
                     </p>
                     <ul className="join-list">
                        <li>
                           <a href="https://www.facebook.com/gettingstarted?step=friend_requests">
                              <img className="img-height" src={facebook} alt="telegram" />
                           </a>
                        </li>
                        <li>
                           <a href="https://twitter.com/Xanshow"><img src={twitterIcon} alt="twitter" /></a>
                        </li>
                        <li>
                           <a href="https://www.linkedin.com/feed/?trk=onboarding-landing">
                              <img className="img-height" src={linkdin} alt="telegram" />
                           </a>
                        </li>
                        <li>
                           <a className="wechat-btn" href="#"><img src={instagram} alt="instagram" /></a>
                        </li>
                        <li>
                           <a href="https://medium.com/@xanshow.mkt"><img src={medium} alt="medium" /></a>
                        </li>
                        <li>
                           <a href="https://www.reddit.com/user/xanshow_"><img src={reddit} alt="reddit" /></a>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
      </React.Fragment>
    );
  }
}
