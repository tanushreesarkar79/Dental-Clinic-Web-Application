import React, { useState, useEffect,useRef } from 'react';

import logo from './images/d.jpg';

import '@fortawesome/fontawesome-free/css/all.min.css';


import './landingpage.css'; // Custom CSS for animations and layout
import slide1 from './images/5.png'; // Replace with actual images


import h1 from './images/hfloss.jpeg';
import h2 from './images/hbrush.jpeg';
import h3 from './images/hwater.jpeg';
import h4 from './images/hcheck.jpeg';
import h5 from './images/hdiet.jpeg';
import h6 from './images/hmouthwash.jpeg';
import h7 from './images/hold.jpeg';

import h11 from './images/hfloss.png';
import h22 from './images/hbrush.png';
import h33 from './images/hwater.png';
import h44 from './images/hcheck.png';
import h55 from './images/hdiet.png';
import h66 from './images/hmouthwash.png';
import h77 from './images/hold.png';

import s5 from './images/s5.jpg';
import s6 from './images/s6.jpg';
import s7 from './images/s7.jpg';
import s8 from './images/s8.jpg';
import s9 from './images/s9.jpg';
import s10 from './images/s10.jpg';




import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTeeth, faTeethOpen, faBed, faBedPulse, faStethoscope,faBars,faX, faFaceGrinBeam, faFaceGrinWide, faCircleH, faHouseMedicalFlag, faHospital, faHospitalUser, faSmileBeam } from '@fortawesome/free-solid-svg-icons'; // Import more icons as needed

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import emailjs from 'emailjs-com';

const Landingpage = () => {
  

    const [showDropdown, setShowDropdown] = useState(false);  // Dropdown visibility state

 
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Check if the click is outside the dropdown element
        const dropdownElement = document.querySelector('.login-options');
        const loginIconElement = document.querySelector('.login-icon');
        
        if (dropdownElement && !dropdownElement.contains(event.target) &&
            loginIconElement && !loginIconElement.contains(event.target)) {
          setShowDropdown(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  






  const images = [
    { src: h1, details: h11 },
    { src: h2, details: h22},
    { src: h3, details: h33 },
    { src: h4, details: h44 },
    { src: h5, details: h55 },
    { src: h6, details: h66},
    { src: h7, details: h77 },



    // Add more images with their details
  ];
  const [flippedIndex, setFlippedIndex] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const scroll = () => {
      scrollContainer.scrollLeft += 1;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0; // Loop back to the start
      }
    };

    const scrollInterval = setInterval(scroll, 15); // Adjust speed if needed

    return () => clearInterval(scrollInterval);
  }, []);

  const handleClick = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };



  const Card = ({ icon, title, details }) => {
    return (
      <div className="landingpage-card">
        <div className="landingpage-card-header">
          <FontAwesomeIcon icon={icon} size="3x" className="landingpage-service-logo" />
        </div>
        <div className="landingpage-card-body">
          
          <h5 className="landingpage-card-title">{title}</h5>
          <hr />
          <p className="landingpage-card-text">{details}</p>
        </div>
      </div>
    );
  };
  const cardData = [
    { icon: faSmileBeam, title: 'Digital Smile Designing', details: 'A Smile Design is the planning process for creating your individualized treatment plan to take your smile from what it is now into a smile you can be proud of and makes you feel more confident. ' },
    { icon: faTeethOpen, title: ' Oral prophylaxis', details: ' Oral prophylaxis is a dental procedure that involves cleaning teeth to remove plaque, tartar, stains, and other buildup. It prevents dental diseases like gum disease and tooth decay. ' },
    { icon: faFaceGrinWide, title: 'Teeth Whitening / Bleaching', details: "Teeth whitening involves bleaching your teeth to make them lighter. It can't make your teeth brilliant white, but it can lighten the existing colour by several shades."  },
    { icon: faTeeth, title: 'Prosthodontic treatment ', details: 'Prosthodontic treatment is a dental specialty that involves diagnosing, planning, and treating patients with missing, damaged, or deficient teeth. '  },
    { icon: faTeethOpen, title: 'Root Canal Treatment', details:'A root canal Treatment is a dental procedure that treats an infected or damaged tooth by removing the infected pulp and cleaning the canals inside the tooth.'  },
    { icon: faBed, title: 'Pedodontic Treatment', details:"It is strongly advised that all young children be examined by a paediatric dentist from an early age. The first step in treatment is the patient's first dental checkup." },
    { icon: faBedPulse, title: 'Dental Bridges', details: 'These restorations replace missing teeth by taking support from the adjacent teeth.' },
    { icon: faStethoscope, title: 'Tooth Extraction', details: ' A tooth extraction is a procedure to remove a tooth from the gum socket. It is a common dental treatment that can be performed by a general dentist, oral surgeon, or periodontist.' },
    { icon: faCircleH, title: 'Dental Crowns', details: 'These can repair teeth that have cracks, fractures, or significant decay. '  },
    { icon: faHouseMedicalFlag, title: 'Dental Implants', details: 'These custom-made restorations can replace missing teeth by taking support from the underlying bone and provide stability and strength. '  },
    { icon: faHospital, title: 'Dentures', details: 'Solid or removable dentures can be fitted and placed by a prosthodontist. ' },
    { icon: faHospitalUser, title: 'Headgear', details: 'In some cases, headgear may be used in addition to braces. '  },
    { icon: faTeethOpen, title: 'Jaw screws', details: 'Small screws may be temporarily placed in the jaw in addition to braces. '  },
    { icon: faTeeth, title: 'Clear Aligners', details: " Clear-aligner treatment involves taking a digital tooth scan and The computerized model suggests stages between the current and desired teeth positions. " },
    { icon: faFaceGrinBeam, title: 'Removable retainers', details: 'Custom-fitted, clear plastic retainers that hold teeth in place. ' },
   ];


   const explanations = [

  
    {imgSrc: s7},
    {imgSrc: s8},
    {imgSrc: s9},
    {imgSrc: s10},
   /*  {imgSrc: s5},
    {imgSrc: s6}, */
    { text: "Download our app for a seamless dental care experience.", 
      imgSrc: "/images/s2.jpg" },
    { text: "Quickly book your dental appointments by selecting your preferred date and time. Manage and track your appointments effortlessly.", imgSrc: "/images/s1.jpg" },
    { text: "Create a patient account on Cladent by entering your name, email, and phone number. Verify your account via email to start booking appointments.", imgSrc: "/images/s4.jpg" },
    { text: "Log in to Cladent by entering your registered email and password on the login screen. Access your account to manage appointments and view your details.", imgSrc: "/images/s3.jpg" },
    // Add more steps as needed
  ];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      nextStep();
    }, 2000); // Change step every 5 seconds
    return () => clearInterval(autoScroll);
  }, [currentStep]);

  const nextStep = () => {
    setCurrentStep((prevStep) => (prevStep + 1) % explanations.length);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep - 1 + explanations.length) % explanations.length);
  };
  


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send('service_api', 'template_api', formData, 'API') // paste the email Js api here
      .then((response) => {
        console.log('Email sent successfully:', response);
        alert('Message sent successfully!');
      }, (err) => {
        console.log('Failed to send email:', err);
        alert('Failed to send message. Please try again.');
      });
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };




  return (
    <div className="landingpage-container">
 
 <div className="landingpage-navbar">
      <div className="landingpage-navbar-left">
        <img src={logo}  alt="Clinic Logo" className="landingpage-logo" />
        <span className="landingpage-clinic-name">
          Dr. Nithya's
          <br />
          <div className="landingpage-clinic-name-1">
            Dental & Smile Design Clinic
          </div>
        </span>
      </div>

      {/* Navigation menu */}
      <div className="landingpage-navbar-menu-container">
      <div
        className={`landingpage-navbar-menu ${
          isMenuOpen ? "visible" : "hidden"
        }`}
      >
        <a href="#about-section" className="landingpage-login-icon">
          ABOUT US
        </a>
        <a href="#services-section" className="landingpage-login-icon">
          SERVICES
        </a>
{/*         <a href="#services-section" className="landingpage-login-icon">
          BOOK APPOINTMENT
        </a> */}
        <a href="#app-section" className="landingpage-login-icon">
          CLADENT APP
        </a>
{/*         <a href="#health-section" className="landingpage-login-icon">
          Oral Care Tips
        </a> */}
        <a href="#contact-section" className="landingpage-login-icon">
          CONTACT US
        </a>
        <div className="login-btn">
          <a href="/authenticate" className="landingpage-login-icon">
            ADMIN LOGIN
          </a>
        </div>
      </div>

      {/* Menu button */}
      {!isMenuOpen ? (
        <div
          className="landingpage-navber-menu-button"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
      ) : (
        <div
          className="landingpage-navber-menu-button-1"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faX} />
        </div>
      )}
    </div>
      </div>

      
    
     
   
    


    <div className="landingpage-start-container" id="home-section" >
    <div className="landingpage-start">
    <div className="landingpage-start-title">Welcome to Our Clinic</div>
    <p className="landingpage-description">
    Discover exceptional care with our expert team. Your health and well-being are our top priorities. 
    We combine advanced medical expertise with a compassionate approach to ensure you receive the best care possible.
    </p>
    <ul className="landingpage-highlights">
      <li> Comprehensive medical services tailored to your needs</li>
      <li> State-of-the-art facilities and cutting-edge technology</li>
      <li> Trusted by thousands of satisfied patients</li>
      <li> Experienced specialists in various fields of medicine</li>
    </ul>
    <button className="explore-btn"   onClick={() => {
        document.getElementById("about-section").scrollIntoView({ behavior: "smooth" });
      }}>Explore</button>
    </div>
    <div className="landingpage-start-img">
    <img src={slide1} alt="Clinic Image" className="landingpage-start-img" />
    </div>
    
    </div>
    
    


    <div className="landingpage-about-main" id="about-section">
    <div className="landingpage-about">
      <div style={{color:'darkblue',fontStyle:'bold',fontFamily:'cursive',fontSize:'45px'}}>About Us</div>
      <br/>
      <p>
      <i>
      Welcome to Dr. Nithya’s Dental and Smile Design Clinic, where we prioritize your oral health and aim to create radiant smiles that last a lifetime. With a patient-centered approach, we blend advanced dental care with a compassionate touch to ensure your comfort and satisfaction.<br/><br/>
Our clinic is equipped with state-of-the-art technology and follows modern dentistry practices to deliver precise and effective treatments. From routine cleanings to complex dental procedures, we offer a comprehensive range of services tailored to meet the unique needs of every individual.<br/><br/>
We specialize in cosmetic dentistry, preventive care, orthodontics, restorative treatments, and more. Our services extend to patients of all ages, making us the ideal choice for family dental care. Whether it’s a child’s first dental visit, a cosmetic enhancement, or restoring oral health, we are here to help.
 </i>
      </p>  
      </div>
</div>
   



    <div className="landingpage-service-container" id="services-section" >
      <div className="landingpage-service">
        <div style={{textAlign:'center',color:'#03C0C1',fontStyle:'bold',fontFamily:'cursive',fontSize:'45px'}}>Services</div><br/><br/>
        <div className="landingpage-treat">
        {cardData.map((card, index) => (
          <Card key={index} icon={card.icon} title={card.title} details={card.details} />
        ))}
        </div>
      </div>
    </div>


<div className='landingpage-mob'>
  <div className="landingpage-mobile-container" id="app-section">
    <div className="landingpage-title" style={{color:'lightgrey',fontStyle:'bold',fontFamily:'cursive',fontSize:'45px'}}>Cladent App</div>

    <div className="landingpage-flex-container">
      <div className="landingpage-left-explanation">
        <div className="landingpage-box" id="box1">
          <i>The <b>Cladent App</b> ensures a hassle-free experience with its secure login and registration system. Patients can quickly create an account or log in to access personalized features tailored to their dental care needs.</i>
        </div><br />
        <div className="landingpage-box" id="box2">
          <i><b>Booking</b> an appointment is simple and convenient. Patients can select their preferred date and time, ensuring their dental visits fit smoothly into their schedule.</i>
        </div><br />
        <div className="landingpage-box" id="box3">
          <i>The app allows patients to book appointments not just for themselves but also for <b>friends and family</b>. This feature makes it easy to ensure loved ones receive timely dental care, all through one account.</i>
        </div>
      </div>
      <div className="landingpage-right-screenshot">
        <div className="landingpage-android-frame">
          <img src={explanations[currentStep].imgSrc} alt={`Step ${currentStep + 1}`} />
        </div>
      </div>
      <div className="landingpage-ex">
        <div className="landingpage-box" id="box4">
          <i>The app provides patients with valuable oral health tips and educational content, promoting better <b>dental hygiene</b> and preventive care practices.</i>
        </div><br />
        <div className="landingpage-box" id="box5">
          <i>Patients can explore detailed descriptions of all the services offered at <b>Dr. Nithya's Dental and Smile Design Clinic</b>, helping them make informed decisions about their treatment.</i>
        </div><br />
        <div className="landingpage-box" id="box6">
          <i>Patients can keep their profiles updated, including their personal information, contact details, and preferences. This helps the clinic offer <b>personalized services</b> tailored to their needs.</i>
        </div>
      </div>
    </div>
  </div>
</div>



    <div className='landingpage-health'>
  <div style={{textAlign:'center',color:'darkgreen',fontStyle:'bold',fontFamily:'cursive',fontSize:'45px'}}>Oral Care Tips</div>
    <div id="health-section"/* "landingpage-scroll-container" */  className="landingpage-scroll-container" ref={scrollContainerRef}>
     
      <div className="landingpage-scroll-content" >
       
        {images.map((image, index) => (
          <div
            key={index}
            className={`landingpage-image-container ${flippedIndex === index ? 'flipped' : ''}`}
            onClick={() => handleClick(index)}
          >
            <div className="landingpage-image-front">
              <img src={image.src} alt={` ${index + 1}`} />
            </div>
            <div className="landingpage-image-back">
             {/*  <p>{image.details}</p> */}
              <img src={image.details} alt={` ${index + 1}`}  />
            </div>
          </div>
        ))}
    
        {images.map((image, index) => (
          <div
            key={index + images.length}
            className={`landingpage-image-container ${flippedIndex === index ? 'flipped' : ''}`}
            onClick={() => handleClick(index)}
          >
            <div className="landingpage-image-front">
              <img src={image.src} alt={` ${index + 1}`} />
            </div>
            <div className="landingpage-image-back">
            {/*   <p>{image.details}</p> */}
              <img src={image.details} alt={` ${index + 1}`}  />
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>

  

    
   

     
    <div className="landingpage-footer" id="contact-section" >
      <div className="landingpage-footer-left">
        <p>Dr. Nithya's Dental and Smile Design Clinic</p>
        <p>Dr. Nithya Selvaraj,MDS<br/>
Prosthodontist & Implantologist<br/>
Reg. No. - 49867-A
</p>
        <p>Address: <a href="https://www.google.com/maps/@12.9554941,77.6587568,18z?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Dr. Nithya's Dental and Smile Design Clinic.<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;616, 3rd Cross, 1st Main, A Block,
<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Vinayak Nagar,Konena Agrahara,
<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bengaluru-560017.</a></p>
        <p>Contact Number: <a href="tel:+91 974-121-7007">+91 974-121-7007</a></p>
        <p>Email: <a href="mailto:clinic@example.com">dr.nit.sel@gmail.com</a></p>
       
        <p ><a  href="https://cladentteamfornaacvisit.netlify.app/" target="_blank" rel="noopener noreferrer">&copy; PUDoCs. All rights reserved.</a></p>
      
      </div>

      <div className="landingpage-social-media">
  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook-f"></i>
  </a><br/><br/>
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <i className="fa-brands fa-instagram-square"></i>
  </a><br/><br/>
  <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-twitter"></i>
  </a><br/><br/>
  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-linkedin-in"></i>
  </a>
</div>

<div className='landingpage-footer-link'>
  <h3 >Quick Links</h3>
  <br/>
  <ul>
    <li><a href="#home-section">Home</a></li>
    <li><a href="#about-section">About Us</a></li>
    
    <li><a href="#services-section">Services</a></li>
    <li><a href="#app-section">Cladent App</a></li>
    <li><a href="#health-section">Oral Care Tips</a></li>
   
  </ul>
</div>

      <div className="landingpage-footer-right">
        <h3>Contact Us</h3>
        <form onSubmit={handleSubmit} className="landingpage-contact-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
            required
          />
          <button type="submit" className="landingpage-contact-submit">Send</button>
        </form>
      </div>

      
    </div>

    </div>
  );
};

export default Landingpage;
