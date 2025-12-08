import React from 'react';
import { Heart, Users, Award, Sparkles } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Handmade with Love',
      description: 'Every product is crafted with care and attention to detail, ensuring each piece is unique and special.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We support local artisans and craftspeople, building a community of creative individuals.'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'We use only premium materials and maintain the highest standards in every product we create.'
    },
    {
      icon: Sparkles,
      title: 'Custom Made',
      description: 'Personalize your items to fit your emotions and make them truly yours.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Designer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'
    },
    {
      name: 'Michael Chen',
      role: 'Master Craftsman',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300'
    },
    {
      name: 'David Kim',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
    }
  ];

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif text-gray-800 mb-6">About AQUALIFE</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We believe in the power of handmade craftsmanship and the beauty of products made with love. 
            Every item in our collection tells a story and carries the passion of our talented artisans.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600" 
              alt="Our workspace"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              AQUALIFE was born from a simple idea: to create beautiful, handmade products that bring joy 
              to everyday life. What started as a small workshop in 2018 has grown into a community of passionate 
              artisans dedicated to their craft.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Each product is carefully designed and handcrafted using traditional techniques combined with 
              modern aesthetics. We source sustainable materials and work closely with local craftspeople to 
              ensure every piece meets our high standards of quality.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, we're proud to serve customers across India, spreading the love of handmade products 
              and supporting the artisan community.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-gray-800 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-gray-800 text-center mb-4">Meet Our Team</h2>
          <p className="text-gray-600 text-center mb-12">
            The talented people behind AQUALIFE
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="mb-4 overflow-hidden rounded-full w-48 h-48 mx-auto">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">5000+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">200+</div>
              <p className="text-gray-600">Unique Products</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">50+</div>
              <p className="text-gray-600">Local Artisans</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">6+</div>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif text-gray-800 mb-4">Join Our Journey</h2>
          <p className="text-gray-600 mb-8">
            Explore our collection and find something that speaks to your heart
          </p>
          <a 
            href="/collection"
            className="inline-block bg-gray-700 text-white px-10 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors no-underline"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;