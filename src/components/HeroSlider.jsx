import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroSlider.css';

const slides = [
  {
    id: 1,
    image: '/images/Banner.webp',
    edition: '3rd Edition Rajkot',
    date: '19-20-21-22 DEC 2027',
    location: (
      <>
        NSIC GROUND, 80 FEET ROAD,<br />
        RAJKOT (GUJARAT).
      </>
    ),
    info: 'A Multi Category Industrial Exhibition',
    link: '/about'
  },
  {
    id: 2,
    image: '/images/ai-generated-advanced-robotic-assembly-lines-in-a-vast-industrial-factory-illuminated-by-the-warm-glow-of-afternoon-light-showcasing-the-future-of-industrial-automation-photo.webp',
    edition: '2nd Edition Ahmedabad',
    date: '20-21-22-23 NOV 2026',
    location: (
      <>
        GMDC GROUND,<br />
        AHMEDABAD, GUJARAT 380052
      </>
    ),
    info: 'A Multi Category Industrial Exhibition',
    link: '/about'
  },
  {
    id: 3,
    image: '/images/Engitech-Slider-Banner-03.webp',
    edition: '4th Edition Vadodara',
    date: '21-22-23-24 JAN 2028',
    location: (
      <>
        VADODARA
      </>
    ),
    info: 'A Multi Category Industrial Exhibition',
    link: '/about'
  }
];

export default function HeroSlider() {
  return (
    <div className="hero-slider-wrapper">
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        pagination={{
          el: '.hero-pagination',
          clickable: true,
        }}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="hero-slide-bg" 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Optional overlay to ensure text readability */}
              <div className="hero-slide-overlay"></div>
              
              <div className="container hero-slide-content">
                <div className="hero-edition-box">
                  {slide.edition}
                </div>
                
                <h2 className="hero-main-title">
                  <span className="hero-date">{slide.date}</span>
                  <br />
                  <span className="hero-location">{slide.location}</span>
                </h2>
                
                <div className="hero-info-box">
                  {slide.info}
                </div>
                
                <div className="hero-btn-wrap">
                  <a href={slide.link} className="hero-btn">
                    Discover More 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Custom Navigation */}
        <div className="hero-controls">
          <div className="hero-pagination"></div>
          <div className="hero-nav-buttons">
            <button className="hero-prev">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
            </button>
            <button className="hero-next">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </button>
          </div>
        </div>
      </Swiper>
    </div>
  );
}
