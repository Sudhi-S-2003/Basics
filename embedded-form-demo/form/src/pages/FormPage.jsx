import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2 } from 'lucide-react';

function FormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    subscribe: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [theme, setTheme] = useState('light');
  const formRef = useRef(null);

  // Listen for theme changes from parent
  useEffect(() => {
    const handleMessage = (event) => {
      // SECURITY NOTE: In production, verify event.origin matches your parent domain
      // Replace "*" with specific origin: if (event.origin !== "https://your-parent-domain.com") return;
      
      if (event.data.type === 'theme-change') {
        setTheme(event.data.theme);
        document.documentElement.classList.toggle('dark', event.data.theme === 'dark');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send height updates to parent iframe
  useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      // SECURITY NOTE: Replace "*" with parent origin in production
      window.parent.postMessage(
        { type: 'form-height', height },
        '*' // Replace with specific parent origin in production
      );
    };

    // Send height on mount and whenever content changes
    sendHeight();

    // Use ResizeObserver for better height tracking
    const resizeObserver = new ResizeObserver(sendHeight);
    if (formRef.current) {
      resizeObserver.observe(formRef.current);
    }

    // Fallback for older browsers
    const interval = setInterval(sendHeight, 500);

    return () => {
      resizeObserver.disconnect();
      clearInterval(interval);
    };
  }, [isSubmitted]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.topic) {
      newErrors.topic = 'Please select a topic';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit successful
    setIsSubmitted(true);
    
    // Send data to parent
    // SECURITY NOTE: Replace "*" with parent origin in production
    window.parent.postMessage(
      {
        type: 'form-submitted',
        data: formData
      },
      '*' // Replace with specific parent origin in production
    );

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        topic: '',
        message: '',
        subscribe: false,
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div 
        ref={formRef}
        className="min-h-screen flex items-center justify-center p-4 bg-background"
      >
        <div className="w-full max-w-md text-center">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-card-foreground">Thank You!</h2>
            <p className="text-muted-foreground">
              Your form has been submitted successfully. We'll get back to you soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={formRef}
      className="min-h-screen flex items-center justify-center p-4 bg-background"
    >
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border border-border">
          <h1 className="text-3xl font-bold mb-2 text-card-foreground">Contact Us</h1>
          <p className="text-muted-foreground mb-6">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                aria-required="true"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-sm text-destructive" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Topic Select */}
            <div className="space-y-2">
              <Label htmlFor="topic">
                Topic <span className="text-destructive">*</span>
              </Label>
              <Select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.topic}
                aria-describedby={errors.topic ? "topic-error" : undefined}
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales</option>
                <option value="partnership">Partnership</option>
                <option value="feedback">Feedback</option>
              </Select>
              {errors.topic && (
                <p id="topic-error" className="text-sm text-destructive" role="alert">
                  {errors.topic}
                </p>
              )}
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows={5}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-destructive" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Subscribe Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="subscribe"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
                aria-describedby="subscribe-description"
              />
              <div className="flex-1">
                <Label 
                  htmlFor="subscribe"
                  className="cursor-pointer font-normal"
                >
                  Subscribe to our newsletter
                </Label>
                <p id="subscribe-description" className="text-sm text-muted-foreground">
                  Get updates about new features and announcements.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg"
              className="w-full"
            >
              Submit Form
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormPage;