import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Users, Award } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store enquiry locally (in a real app, this would go to a backend)
    const enquiries = JSON.parse(localStorage.getItem('footprint_enquiries') || '[]');
    const newEnquiry = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString()
    };
    enquiries.push(newEnquiry);
    localStorage.setItem('footprint_enquiries', JSON.stringify(enquiries));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon."
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "gundayenatasha12@gmail.com",
      description: "Drop us a message and we'll get back to you"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "xxxxxxxxxx",
      description: "We're here to help during business hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Mumbai, India",
      description: "Come visit us at our office"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Expert Support",
      description: "Our environmental specialists are here to help you understand and reduce your carbon footprint."
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Join thousands of users who have successfully reduced their environmental impact with our guidance."
    },
    {
      icon: MessageSquare,
      title: "Quick Response",
      description: "We typically respond to all inquiries within 24 hours during business days."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in <span className="text-gradient-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about carbon footprints? Need help with our calculator? 
            We're here to support your journey to a sustainable future.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card-eco">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-eco"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-eco"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="input-eco"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="calculator">Calculator Support</option>
                  <option value="account">Account Issues</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="input-eco resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground 
                                rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-foreground font-medium mb-1">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Contact Us */}
            <div className="card-eco">
              <h3 className="text-xl font-bold text-foreground mb-4">Why Contact Us?</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="card-eco">
              <h3 className="text-xl font-bold text-foreground mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground font-medium">Closed</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * All times are in Eastern Standard Time (EST)
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How accurate is the carbon footprint calculator?",
                answer: "Our calculator uses scientifically-backed emission factors and is regularly updated to ensure 95%+ accuracy for personal carbon footprint calculations."
              },
              {
                question: "Is my personal data safe and secure?",
                answer: "Yes, we use enterprise-grade security measures to protect your data. We never share your personal information with third parties."
              },
              {
                question: "Can I track my progress over time?",
                answer: "Absolutely! Your dashboard shows your calculation history, trends, and progress towards reducing your carbon footprint."
              },
              {
                question: "Do you offer carbon offset programs?",
                answer: "While we focus on calculation and reduction, we're happy to recommend verified carbon offset programs that align with your sustainability goals."
              }
            ].map((faq, index) => (
              <div key={index} className="card-eco">
                <h4 className="font-semibold text-foreground mb-3">{faq.question}</h4>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;