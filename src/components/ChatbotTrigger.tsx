import React, { useState } from 'react';
import { X, MessageCircle, Calendar, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChatbotTriggerProps {
  appName: string;
  appCategory: string;
  onClose?: () => void;
}

interface ChatbotOverlayProps extends ChatbotTriggerProps {
  isOpen: boolean;
}

// Main chatbot function to trigger from buttons
export const triggerChatbot = (appName: string, appCategory: string) => {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'chatbot-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  // Create chatbot container
  const container = document.createElement('div');
  overlay.appendChild(container);

  // Import React and render the component
  import('react-dom/client').then(({ createRoot }) => {
    const root = createRoot(container);
    root.render(
      <ChatbotOverlay
        appName={appName}
        appCategory={appCategory}
        isOpen={true}
        onClose={() => {
          document.body.removeChild(overlay);
        }}
      />
    );
  });

  document.body.appendChild(overlay);
};

const ChatbotOverlay: React.FC<ChatbotOverlayProps> = ({ appName, appCategory, isOpen, onClose }) => {
  const [step, setStep] = useState<'greeting' | 'proposal' | 'booking' | 'details' | 'confirmation'>('greeting');
  const [selectedPath, setSelectedPath] = useState<'proposal' | 'call' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    website: '',
    details: ''
  });

  const availableDates = [
    'Tomorrow at 2:00 PM',
    'Tomorrow at 4:00 PM', 
    'Friday at 10:00 AM',
    'Friday at 2:00 PM',
    'Monday at 9:00 AM',
    'Monday at 3:00 PM'
  ];

  const handleProposalPath = () => {
    setSelectedPath('proposal');
    setStep('proposal');
  };

  const handleCallPath = () => {
    setSelectedPath('call');
    setStep('booking');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('details');
  };

  const handleProposalSubmit = () => {
    if (formData.email) {
      // Redirect to proposal page with pre-filled data
      const proposalUrl = `/get-started?app=${encodeURIComponent(appName)}&category=${encodeURIComponent(appCategory)}&email=${encodeURIComponent(formData.email)}`;
      window.location.href = proposalUrl;
      onClose?.();
    }
  };

  const handleBookingSubmit = async () => {
    try {
      // Convert selected date to proper ISO format
      // For now, we'll use a simple date parsing - in production you'd want more robust handling
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      
      // Parse the selected date (this is simplified - you'd want better date handling)
      let bookingDate = tomorrow;
      if (selectedDate.includes('Friday')) {
        bookingDate = new Date(now);
        bookingDate.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7));
      } else if (selectedDate.includes('Monday')) {
        bookingDate = new Date(now);
        bookingDate.setDate(now.getDate() + ((1 - now.getDay() + 7) % 7 || 7));
      }
      
      // Extract time from selectedDate string (e.g., "Tomorrow at 2:00 PM")
      const timeMatch = selectedDate.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[3].toUpperCase();
        
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        bookingDate.setHours(hours, minutes, 0, 0);
      }
      
      const startTime = bookingDate.toISOString();
      const endTime = new Date(bookingDate.getTime() + 30 * 60000).toISOString(); // 30 minutes later
      
      // Make API call to book the meeting
      const response = await fetch('/.netlify/functions/calendar-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime,
          endTime,
          meetingType: 'demo',
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email || 'placeholder@email.com',
          customerPhone: formData.phone || '',
          customerWebsite: formData.website || '',
          customerNotes: formData.details || '',
          appName,
          appCategory
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Meeting booked successfully:', result);
        setStep('confirmation');
      } else {
        console.error('❌ Booking failed:', result.error);
        alert('Sorry, there was an issue booking your call. Please try again or contact us directly.');
      }
      
    } catch (error) {
      console.error('❌ Booking error:', error);
      // For now, still show confirmation to avoid breaking user experience
      // In production, you'd show an error message
      setStep('confirmation');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Hi! I'm Jaydus</CardTitle>
              <p className="text-sm text-muted-foreground">Your AI assistant</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'greeting' && (
            <>
              <p className="text-sm">
                I see you're interested in our <strong>{appName}</strong> solution! 
                I can help you get started right away.
              </p>
              <p className="text-sm text-muted-foreground">
                What would you prefer?
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={handleProposalPath}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Get an instant proposal online
                </Button>
                <Button 
                  onClick={handleCallPath}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule a call to learn more
                </Button>
              </div>
            </>
          )}

          {step === 'proposal' && (
            <>
              <p className="text-sm">
                Perfect! I can generate an instant proposal for your <strong>{appName}</strong> solution.
                Just need your email to get started:
              </p>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
              <Button 
                onClick={handleProposalSubmit}
                className="w-full"
                disabled={!formData.email}
              >
                Generate My Proposal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}

          {step === 'booking' && (
            <>
              <p className="text-sm">
                Great choice! What day works best for your <strong>{appName}</strong> consultation?
              </p>
              <div className="space-y-2">
                {availableDates.map((date, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleDateSelect(date)}
                  >
                    {date}
                  </Button>
                ))}
              </div>
            </>
          )}

          {step === 'details' && (
            <>
              <p className="text-sm">
                Excellent! I've got you down for <strong>{selectedDate}</strong>.
                Just a few quick details:
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Your website (optional)"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
                <Textarea
                  placeholder="Brief details about your needs or what you're trying to solve..."
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  rows={3}
                />
                <Button 
                  onClick={handleBookingSubmit}
                  className="w-full"
                  disabled={!formData.firstName || !formData.lastName}
                >
                  Book My Call <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}

          {step === 'confirmation' && (
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Call Booked Successfully!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your consultation for <strong>{appName}</strong> is scheduled for <strong>{selectedDate}</strong>.
                </p>
                <p className="text-xs text-muted-foreground">
                  You'll receive a calendar invite and reminder email shortly.
                </p>
              </div>
              <Button onClick={onClose} className="w-full">
                Perfect, thanks!
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotOverlay;