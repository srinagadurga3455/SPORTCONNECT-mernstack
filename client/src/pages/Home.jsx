import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";

/**
 * Home.jsx
 * Full conversion of original HTML -> React JSX
 * Single-file component (error-free, accessible anchors & alts)
 */

function Home() {
  useEffect(() => {
    // Initialize AOS if available
    if (window.AOS && typeof window.AOS.init === "function") {
      window.AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
      });
    }

    // Initialize Bootstrap Carousel
    const carouselElement = document.getElementById('featuredSports');
    if (carouselElement && window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(carouselElement, {
        interval: 3000,
        ride: 'carousel',
        pause: 'hover',
        wrap: true
      });
    }

    // Back to top button, navbar scroll behavior
    const backToTopButton = document.getElementById("backToTop");
    const navbar = document.querySelector(".navbar");

    const onScroll = () => {
      if (backToTopButton) {
        if (window.pageYOffset > 300) backToTopButton.classList.add("active");
        else backToTopButton.classList.remove("active");
      }
      if (navbar) {
        if (window.pageYOffset > 50) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", onScroll);

    // Floating icons generation (decorative)
    const container = document.getElementById("floatingIcons");
    if (container) {
      // clear any previous children (idempotent)
      container.innerHTML = "";
      const icons = ["🏏", "🏀", "⚽", "🎾", "🏸", "🏐", "🏓", "🏒", "⛳", "🥊"];
      for (let i = 0; i < 25; i++) {
        const icon = document.createElement("span");
        icon.textContent = icons[Math.floor(Math.random() * icons.length)];
        icon.style.fontSize = `${Math.floor(Math.random() * 30) + 20}px`;
        icon.style.left = `${Math.random() * 100}%`;
        icon.style.top = `${Math.random() * 100}%`;

        const animations = ["floatUp", "floatDiagonal", "floatSide"];
        const chosen = animations[Math.floor(Math.random() * animations.length)];
        const duration = Math.floor(Math.random() * 20) + 20;

        if (chosen === "floatSide") {
          icon.style.setProperty("--startY", `${Math.random() * 90}vh`);
        }

        icon.style.animation = `${chosen} ${duration}s linear infinite, fadeSize ${
          Math.floor(Math.random() * 5) + 5
        }s ease-in-out infinite`;

        container.appendChild(icon);
      }
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (container) container.innerHTML = "";
    };
  }, []);

  // Utility: prevent default for no-op links
  const preventDefault = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {/* Floating sports icons (decorative background) */}
      <div className="floating-icons" id="floatingIcons" aria-hidden="true" />

      {/* Back to Top Button */}
      <a href="#home" className="back-to-top" id="backToTop" aria-label="Back to top">
        <i className="bi bi-arrow-up" />
      </a>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" role="navigation" aria-label="Main Navigation">
        <div className="container">
          <a className="navbar-brand" href="#home">
            <i className="bi bi-broadcast-pin-fill me-2" aria-hidden="true" />
            Sport<span>Connect</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#home" onClick={preventDefault}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#sports">Sports</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#locations">Locations</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#testimonials">Testimonials</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>

              <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                <Link className="btn btn-primary" to="/login">Join Now</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home" tabIndex="-1">
        <div className="floating-element one" aria-hidden="true"></div>
        <div className="floating-element two" aria-hidden="true"></div>

        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content" data-aos="fade-right">
              <h1 className="hero-title">Connect Through Sports</h1>
              <p className="hero-subtitle">
                Find, join and organize sports events in your area. Connect with fellow sports enthusiasts and take your game to the next level.
              </p>
              <div className="hero-btns">
                <Link className="btn btn-primary btn-lg" to="/signup">Get Started</Link>
                <button className="btn btn-outline-primary btn-lg" type="button" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                  Learn More
                </button>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-left">
              <div className="hero-image" aria-hidden="true">
                <img
                  src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3"
                  alt="People playing sports"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Carousel (kept simple & accessible) */}
      <section className="sports-carousel" aria-labelledby="sports-heading">
        <div className="container">
          <h2 id="sports-heading" className="text-center section-title" data-aos="fade-up">Popular Sports</h2>

          <div id="featuredSports" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" aria-label="Featured sports carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3"
                  className="d-block w-100"
                  alt="Cricket match"
                />
                <div className="carousel-caption">
                  <h3>Cricket</h3>
                  <p>Join exciting cricket matches and tournaments near you. Find players, teams and events.</p>
                  <Link className="btn btn-primary" to="/signup">Get Started</Link>
                </div>
              </div>

              <div className="carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3"
                  className="d-block w-100"
                  alt="Football match"
                />
                <div className="carousel-caption">
                  <h3>Football</h3>
                  <p>Find teams and football events in your city.</p>
                  <Link className="btn btn-primary" to="/signup">Get Started</Link>
                </div>
              </div>

              <div className="carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3"
                  className="d-block w-100"
                  alt="Basketball game"
                />
                <div className="carousel-caption">
                  <h3>Basketball</h3>
                  <p>Enjoy competitive basketball games and training sessions with top players.</p>
                  <Link className="btn btn-primary" to="/signup">Get Started</Link>
                </div>
              </div>
            </div>

            <div className="carousel-indicators">
              <button type="button" data-bs-target="#featuredSports" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" />
              <button type="button" data-bs-target="#featuredSports" data-bs-slide-to="1" aria-label="Slide 2" />
              <button type="button" data-bs-target="#featuredSports" data-bs-slide-to="2" aria-label="Slide 3" />
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#featuredSports" data-bs-slide="prev" aria-label="Previous slide">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#featuredSports" data-bs-slide="next" aria-label="Next slide">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* Popular sports cards */}
      <section className="sports-section" id="sports">
        <div className="container">
          <h2 className="text-center section-title" data-aos="fade-up">Popular Sports</h2>
          <div className="row g-4">
            <article className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="sport-card" role="article">
                <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3" className="card-img-top" alt="Cricket players" />
                <div className="card-body">
                  <h5 className="card-title">Cricket</h5>
                  <div className="rating" aria-hidden="true">
                    <i className="bi bi-star-fill" />
                    <i className="bi bi-star-fill" />
                    <i className="bi bi-star-fill" />
                    <i className="bi bi-star-fill" />
                    <i className="bi bi-star-half" />
                    <span className="ms-2">(4.5)</span>
                  </div>
                  <p className="card-text">Join exciting cricket matches and tournaments near you. Find players, teams and events.</p>
                  <span className="event-date">Next Event: Aug 25, 2025</span>
                  <Link className="btn btn-join" to="/signup">Join Now</Link>
                </div>
              </div>
            </article>

            <article className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="sport-card">
                <img src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3" className="card-img-top" alt="Badminton players" />
                <div className="card-body">
                  <h5 className="card-title">Badminton</h5>
                  <div className="rating" aria-hidden="true">
                    <i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" />
                    <span className="ms-2">(4.9)</span>
                  </div>
                  <p className="card-text">Enjoy competitive badminton matches and training sessions at top facilities across India.</p>
                  <span className="event-date">Next Event: Sep 5, 2025</span>
                  <Link className="btn btn-join" to="/signup">Join Now</Link>
                </div>
              </div>
            </article>

            <article className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="sport-card">
                <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3" className="card-img-top" alt="Basketball" />
                <div className="card-body">
                  <h5 className="card-title">Basketball</h5>
                  <div className="rating" aria-hidden="true">
                    <i className="bi bi-star-fill" />
                    <i className="bi bi-star-fill" />
                    <i className="bi bi-star-fill" />
                    <i className="bi bi-star-fill" />
                    <i className="bi bi-star-half" />
                    <span className="ms-2">(4.7)</span>
                  </div>
                  <p className="card-text">Enjoy competitive basketball games and training sessions with top players.</p>
                  <span className="event-date">Next Event: Aug 30, 2025</span>
                  <Link className="btn btn-join" to="/signup">Join Now</Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Locations section */}
      <section className="locations-section" id="locations">
        <div className="container">
          <h2 className="text-center section-title" data-aos="fade-up">Featured Sports Locations Across India</h2>
          <div className="row g-4">
            <article className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="location-card">
                <div className="map-container" aria-hidden="true">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.123456789012!2d81.53345678901234!3d16.543456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMyJzM2LjQiTiA4McKwMzInMDQuNSJF!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin"
                    title="Elite Sports Arena Map"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">Elite Sports Arena</h5>
                  <p className="card-text">Premium indoor facility for badminton, cricket, volleyball and football. Open 24 hours.</p>
                  <div className="mb-2">
                    <i className="bi bi-star-fill text-warning" aria-hidden="true" />
                    <span className="ms-1">4.6 (51 reviews)</span>
                  </div>
                  <a className="btn btn-location" href="https://goo.gl/maps/example" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-geo-alt-fill me-2" aria-hidden="true" /> Mumbai, Maharashtra
                  </a>
                </div>
              </div>
            </article>

            <article className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="location-card">
                <div className="map-container" aria-hidden="true">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.234567890123!2d81.53456789012345!3d16.544567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMyJzQwLjQiTiA4McKwMzInMDkuNSJF!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin"
                    title="PRO Badminton Academy Map"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">PRO Badminton Academy</h5>
                  <p className="card-text">Professional badminton academy with expert coaching and world-class facilities. Opens at 5 AM.</p>
                  <div className="mb-2">
                    <i className="bi bi-star-fill text-warning" aria-hidden="true" />
                    <span className="ms-1">4.9 (140 reviews)</span>
                  </div>
                  <a className="btn btn-location" href="https://goo.gl/maps/example" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-geo-alt-fill me-2" aria-hidden="true" /> Bangalore, Karnataka
                  </a>
                </div>
              </div>
            </article>

          <article className="col-md-4" data-aos="fade-up" data-aos-delay="300">
            <div className="location-card">
              <div className="map-container" aria-hidden="true">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.3456789012345!2d81.53567890123456!3d16.545678901234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMyJzQ0LjQiTiA4McKwMzInMTQuNSJF!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin"
                  title="DNR Ground Map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Sports Complex</h5>
                <p className="card-text">Large outdoor stadium for cricket, basketball and volleyball with modern amenities. Opens at 5 AM.</p>
                <div className="mb-2">
                  <i className="bi bi-star-fill text-warning" aria-hidden="true" />
                  <span className="ms-1">4.4 (2,600 reviews)</span>
                </div>
                <a className="btn btn-location" href="https://goo.gl/maps/example" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-geo-alt-fill me-2" aria-hidden="true" /> Delhi NCR
                </a>
              </div>
            </div>
          </article>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <h2 className="text-center section-title" data-aos="fade-up">Why Choose SportConnect</h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-box">
                <div className="feature-icon"><i className="bi bi-people-fill" aria-hidden="true" /></div>
                <h4>Find Players</h4>
                <p>Connect with players of similar skill levels and interests in your area.</p>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-box">
                <div className="feature-icon"><i className="bi bi-calendar-event-fill" aria-hidden="true" /></div>
                <h4>Join Events</h4>
                <p>Discover and join sports events happening near you with just a few clicks.</p>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-box">
                <div className="feature-icon"><i className="bi bi-trophy-fill" aria-hidden="true" /></div>
                <h4>Organize Games</h4>
                <p>Create your own events and invite players to join your games.</p>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-box">
                <div className="feature-icon"><i className="bi bi-map-fill" aria-hidden="true" /></div>
                <h4>Find Venues</h4>
                <p>Locate the best sports facilities and venues in your city.</p>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-box">
                <div className="feature-icon"><i className="bi bi-chat-dots-fill" aria-hidden="true" /></div>
                <h4>Community</h4>
                <p>Join a thriving community of sports enthusiasts and professionals.</p>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-box">
                <div className="feature-icon"><i className="bi bi-graph-up-arrow" aria-hidden="true" /></div>
                <h4>Track Progress</h4>
                <p>Monitor your performance and improvement over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slot Booking Section */}
      <section className="slot-booking-section" id="booking">
        <div className="container">
          <h2 className="text-center section-title" data-aos="fade-up">Book Your Slot</h2>
          <div className="row g-4">
            <div className="col-md-6" data-aos="fade-right">
              <div className="booking-card">
                <div className="booking-header">
                  <h4>Stadium Slots</h4>
                  <p>Book professional stadium facilities for your games</p>
                </div>
                <div className="booking-body">
                  <ul className="booking-features">
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Professional quality fields/courts</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Equipment available for rent</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Referee services</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Changing rooms & showers</li>
                  </ul>
                  <Link className="btn btn-primary" to="/signup">Book Stadium Slot</Link>
                </div>
              </div>
            </div>

            <div className="col-md-6" data-aos="fade-left">
              <div className="booking-card">
                <div className="booking-header">
                  <h4>Coaching Sessions</h4>
                  <p>Book sessions with professional coaches</p>
                </div>
                <div className="booking-body">
                  <ul className="booking-features">
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Certified professional coaches</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Personalized training programs</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Group or individual sessions</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Performance analysis</li>
                  </ul>
                  <Link className="btn btn-primary" to="/signup">Book Coaching Session</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <h2 className="text-center section-title" data-aos="fade-up">What Our Users Say</h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="testimonial-card">
                <div className="rating" aria-hidden="true">
                  <i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" />
                </div>
                <p>SportConnect has completely changed how I play sports. I've met amazing players and joined competitive leagues through this platform.</p>
                <div className="testimonial-author">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Rahul Sharma" />
                  <div className="author-info">
                    <h6>Rahul Sharma</h6>
                    <p>Cricket Player</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-card">
                <div className="rating" aria-hidden="true">
                  <i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-half" />
                </div>
                <p>As a football enthusiast, finding quality games was tough. Now I have multiple matches every week with great players!</p>
                <div className="testimonial-author">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Priya Patel" />
                  <div className="author-info">
                    <h6>Priya Patel</h6>
                    <p>Football Player</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="testimonial-card">
                <div className="rating" aria-hidden="true">
                  <i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" />
                </div>
                <p>The basketball community here is amazing. I've improved my game significantly by playing with better players regularly.</p>
                <div className="testimonial-author">
                  <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Arjun Mehta" />
                  <div className="author-info">
                    <h6>Arjun Mehta</h6>
                    <p>Basketball Coach</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section" aria-labelledby="newsletter-heading">
        <div className="container">
          <div className="newsletter-content" data-aos="fade-up">
            <h3 id="newsletter-heading">Stay Updated With Sports Events</h3>
            <p>Subscribe to our newsletter to get the latest updates on sports events, tournaments and more.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
              <input type="email" className="form-control" placeholder="Your email address" required aria-label="Email address" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" id="contact">
        <div className="container">
          <h2 className="text-center section-title" data-aos="fade-up">Contact Us</h2>
          <div className="row g-4 mt-4">
            <div className="col-lg-5" data-aos="fade-right">
              <div className="contact-info">
                <h3>Get In Touch</h3>
                <p>Have questions or ideas? We'd love to hear from you — drop us a message!</p>
                <ul>
                  <li><i className="bi bi-geo-alt-fill" aria-hidden="true" /> <span>SportConnect HQ, India</span></li>
                  <li><i className="bi bi-telephone-fill" aria-hidden="true" /> <span>+91 73308 73455</span></li>
                  <li><i className="bi bi-envelope-fill" aria-hidden="true" /> <span>contact@sportconnect.com</span></li>
                  <li><i className="bi bi-clock-fill" aria-hidden="true" /> <span>Monday - Sunday: 6:00 AM - 7:00 PM</span></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-7" data-aos="fade-left">
              <div className="contact-form">
                <h3>Send Us a Message</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                  <div className="row">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Your Name" required aria-label="Your name" />
                    </div>
                    <div className="col-md-6">
                      <input type="email" className="form-control" placeholder="Your Email" required aria-label="Your email" />
                    </div>
                  </div>
                  <input type="text" className="form-control" placeholder="Subject" aria-label="Subject" />
                  <textarea className="form-control" placeholder="Your Message" rows="5" required aria-label="Message" />
                  <button type="submit" className="btn btn-submit"><i className="bi bi-send-fill me-2" aria-hidden="true" /> Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="footer-about">
                <Link to="/" className="footer-logo"><i className="bi bi-broadcast-pin-fill me-2" aria-hidden="true" />SportConnect</Link>
                <p>Connecting sports enthusiasts to players, teams and events in their area. Join our community today!</p>
                <div className="social-links" aria-hidden="true">
                  <a href="#" onClick={preventDefault}><i className="bi bi-facebook" /></a>
                  <a href="#" onClick={preventDefault}><i className="bi bi-twitter" /></a>
                  <a href="https://www.instagram.com/p_h_i_n_e_a_s_and_f_e_r_b/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram" /></a>
                  <a href="https://www.linkedin.com/in/sri-naga-durga-kamireddy-890419322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin" /></a>
                  <a href="#" onClick={preventDefault}><i className="bi bi-youtube" /></a>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-4">
              <div className="footer-links">
                <h5>Quick Links</h5>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#sports">Sports</a></li>
                  <li><a href="#locations">Locations</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#testimonials">Testimonials</a></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-4">
              <div className="footer-links">
                <h5>Sports</h5>
                <ul>
                  <li><a href="#sports">Cricket</a></li>
                  <li><a href="#sports">Football</a></li>
                  <li><a href="#sports">Basketball</a></li>
                  <li><a href="#sports">Tennis</a></li>
                  <li><a href="#sports">Badminton</a></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-4">
              <div className="footer-links">
                <h5>Support</h5>
                <ul>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Community</a></li>
                  <li><a href="#">Safety Tips</a></li>
                  <li><a href="#">Feedback</a></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2">
              <div className="footer-links">
                <h5>Legal</h5>
                <ul>
                  <li><a href="#">Terms</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Cookie Policy</a></li>
                  <li><a href="#">Guidelines</a></li>
                  <li><a href="#">Disclaimer</a></li>
                </ul>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 SportConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
