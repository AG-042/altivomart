"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('subject', form.subject || `Message from ${form.name}`);
      formData.append('message', form.message);
      formData.append('_subject', `Contact Form: ${form.subject || 'New Message'}`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'true');

      const response = await fetch('https://formsubmit.co/support@altivomart.com', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Thank you for your message. We will get back to you soon!');
        setForm({ name: '', email: '', subject: '', message: '' }); // Reset form
      } else {
        alert('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      alert('There was an error sending your message. Please try again.');
      console.error('Error:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-secondary mb-2">Contact Us</h1>
          <p className="text-muted">Need help finding the right products? We're here to help. Reach out and we'll get back to you as soon as we can.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Details */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary">Email</p>
                    <a href="mailto:support@altivomart.com" className="hover:text-primary">support@altivomart.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary">WhatsApp</p>
                    <a 
                      href="https://wa.me/2349132780502" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-green-500 transition-colors"
                    >
                      +234 913 278 0502
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary">Address</p>
                    <p>Altivomart HQ, Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary">Support Hours</p>
                    <p>Mon–Fri: 9:00–18:00 (WAT)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted">
                <div className="flex justify-between">
                  <span>Order Tracking</span>
                  <a className="text-primary hover:underline" href="/track">/track</a>
                </div>
                <div className="flex justify-between">
                  <span>How to Use</span>
                  <a className="text-primary hover:underline" href="/how-to-use">/how-to-use</a>
                </div>
                <div className="flex justify-between">
                  <span>Products</span>
                  <a className="text-primary hover:underline" href="/products">/products</a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  action="https://formsubmit.co/support@altivomart.com"
                  method="POST"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" value={form.message} onChange={handleChange} rows={6} required placeholder="Type your message here..." />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Button type="submit" disabled={sending} className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {sending ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="text-xs text-muted">We usually respond within one business day.</p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* WhatsApp Quick Contact */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="text-muted mb-4">Get instant support via WhatsApp</p>
                  <a
                    href="https://wa.me/2349132780502?text=Hello%2C%20I%20need%20help%20finding%20the%20right%20products%20for%20my%20project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat with us on WhatsApp
                  </a>
                  <p className="text-xs text-muted mt-2">Available during business hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 