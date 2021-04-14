import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import './sliderss.scss';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper';
import { NavLink } from 'react-router-dom';
import { Form } from 'react-bootstrap';

import ArrowIcon from '../../assets/images/home-slider-icon.svg'
import CommingSoon from '../../component/commingSoon/commingSoon';
const loader_image = '';
const GameProvidersIcon = '';
SwiperCore.use([Autoplay])


const singleLoader = {width: "19.5%" , marginRight: "10px" , height: "100%" , backgroundColor: "gainsboro"};
const loaderContainer =  {
  width: "100%",
  height: "150px",
  display: "flex",
  backgroundColor: "white"
} 

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default function Slider({data,loading, title,classname}) {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const history = useHistory();
    const [showPop, setShowPopup] = useState(false);
    // const [ready, setReady] = React.useState(true);

    const handleClose = () => {
        setShowPopup(false)
    }
    const showCommingSoon = ()=>{
        setShowPopup(true);
    }
 

    return (
        <React.Fragment>
          <div className= {"provider-container " +classname}>
          <div className="slider-button">
                <div ref={navigationPrevRef} className="previous-custom" id="prev-custom-arrow">
                        <img src={ArrowIcon}></img>
                    </div>
                    <div ref={navigationNextRef} className="next-custom" id="next-custom-arrow">
                    <img src={ArrowIcon}></img>
                    </div>
            </div>
            <div className="slider-container-title sliderImage-container">
                <div>
                <h5>
                <img src={GameProvidersIcon} alt=""></img>
    <span className="header-sp">{title}</span>
                </h5>
                </div>
            </div>
            {data && data.length > 0 && (
                <Swiper className="slider-twoD"
                    spaceBetween={0}
                    slidesPerGroup={1}
                    observer = {true}
                    observeParents= {true}
                    navigation={{
                      prevEl: navigationPrevRef.current,
                      nextEl: navigationNextRef.current,
                    }}
                    onSwiper={(swiper) => {
                        setTimeout(() => {
                        if(swiper && swiper.params && swiper.params.navigation && swiper.navigation){
                          swiper.params.navigation.prevEl = navigationPrevRef.current
                          swiper.params.navigation.nextEl = navigationNextRef.current
                          swiper.navigation.destroy()
                          swiper.navigation.init()
                          swiper.navigation.update()
                        }
                        })
                    }}
                    breakpoints={{
                        320: {
                          slidesPerView: 1,
                        },
                        575: {
                          slidesPerView: 2,
                        },
                        868: {
                          slidesPerView: 3,
                        },
                        1024: {
                          slidesPerView: 3,
                        },
                        1300: {
                          slidesPerView: 3,
                        },
                        1500: {
                          slidesPerView: 3,
                        },
                        1920: {
                          slidesPerView: 3,
                        }
                        }}>
                    {
                    data.map((item, i) => {
                        return (
                        <SwiperSlide key={i} className="twoDSlider">
                            <div className="grid-item slider-grid-item" onClick={()=>showCommingSoon()}>
                                <div className="gurd-main">
                                <div className="gurd-image slider-image">
                                    <img className="g-image" src={item.image} />
                                </div>
                                <span class="apr-init slider-apr-init">x10% APR</span>
                                </div>
                              
                               
                                  <div className="gurd-footer gurd-slider-footer">
                        <h3 className="sliderProgramm">{item.title}
                       
                        </h3>
                        <div className="wrap-element slider-ele">
                        {/* <div className="footer-location">{item.date}</div> */}
                        <div className="footer-location slider-location">
                        <div className="footer-role">
                            <p className="role">
                                <span>Owner</span><br/>
                                <span className="nameCircle">namehere</span>
                            </p>
                            </div>
                            <div className="footer-role">
                            <p className="role">
                                <span>Artist</span><br/>
                                <span className="nameCircle">namehere</span>
                               
                            </p>
                            </div>
                        </div>
                                        <div className="footer-date slider-date">
                                            <span className="list-price">Late Sale Price</span>
                                            <span className="list-price sale-price">30,430</span>
                                            <span className="list-price list-pr">List Price</span>
                                            <p className="logo-price">
                                            <img src={item.logoImg} />
                                             <p className="price">{item.price}</p>
                                            </p>
                                           
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </SwiperSlide>
                        );
                    })
                  }
                </Swiper>
                )
                }
          </div>
          <CommingSoon handleClose={handleClose} show={showPop} />
        </React.Fragment>
    )
  }

