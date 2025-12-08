import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@AQUALIFE.com',
      link: 'mailto:hello@AQUALIFE.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 98765 43210',
      link: 'tel:+919876543210'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Craft Street, Mumbai, India',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif text-gray-800 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-serif text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-600 hover:text-gray-800 no-underline">
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors">
                  <Instagram className="w-6 h-6 text-pink-600" />
                </a>
                <a href="#" className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors">
                  <Facebook className="w-6 h-6 text-pink-600" />
                </a>
                <a href="#" className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors">
                  <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95 0-5.52-4.48-10-10-10z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-serif text-gray-800 mb-6">Send Us a Message</h2>
              <div onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none resize-none"
                    placeholder="Tell us what's on your mind..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gray-700 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4 bg-pink-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-gray-800 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">What are your business hours?</h3>
              <p className="text-gray-600">We're available Monday to Saturday, 10 AM to 6 PM IST. We respond to all emails within 24 hours.</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Do you offer custom orders?</h3>
              <p className="text-gray-600">Yes! We love creating custom pieces. Contact us with your ideas and we'll work together to bring them to life.</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">What is your return policy?</h3>
              <p className="text-gray-600">We offer easy returns within 7 days of delivery. Items must be unused and in original packaging.</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">How long does shipping take?</h3>
              <p className="text-gray-600">Standard shipping takes 5-7 business days across India. Express shipping is available for faster delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
