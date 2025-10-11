import React, { useState } from 'react';
import './ContactPage.css';
import PageBackground from './components/PageBackground/PageBackground.js';
import UrskaImage from './assets/games-page/Urska1.png';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Please fill in all required fields.'
      });
      return;
    }

    try {
      const response = await fetch('https://usebasin.com/f/d27af3d6b144', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'No Subject',
          message: formData.message
        })
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          error: false,
          message: 'Message sent! We\'ll be in touch soon.'
        });
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Failed to send message. Please try again later.'
      });
    }
  };

  return (
    <PageBackground className="contact-page" opacity={0.08}>
      <div className="contact-content-wrapper">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have questions or want to collaborate? Reach out to us!</p>
        </div>
        
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-image-container">
              <img src={UrskaImage} alt="Urska" className="contact-image" />
            </div>
            <div className="contact-details">
              <h2>Get in Touch</h2>
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>nguyenthaohan214@gmail.com</p>
                </div>
              </div>
              {/* <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Location</h3>
                  <a 
                    href="https://fablesmiths.itch.io" 
                    rel="noopener noreferrer"
                    className="itch-button"
                  >
                    Visit us on Itch.io
                  </a>
                </div>
              </div> */}
            </div>
          </div>
          
          <div className="contact-form-container">
            {formStatus.submitted ? (
              <div className="form-success-message">
                <div className="success-icon">
                  <i className="fas fa-sparkles"></i>
                </div>
                <h3>Message Sent!</h3>
                <p>{formStatus.message}</p>
                <div className="success-icons">
                  <i className="fas fa-envelope-open-text"></i>
                  <i className="fas fa-magic"></i>
                  <i className="fas fa-paper-plane"></i>
                </div>
                <button 
                  className="back-button"
                  onClick={() => setFormStatus({...formStatus, submitted: false})}
                >
                  Back to Form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {formStatus.error && (
                  <div className="form-error">
                    <p>{formStatus.message}</p>
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name <span className="required">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message <span className="required">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageBackground>
  );
}

export default ContactPage;
