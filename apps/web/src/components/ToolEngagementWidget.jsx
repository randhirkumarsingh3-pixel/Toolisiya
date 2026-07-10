import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star, MessageSquarePlus, Share2, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ToolEngagementWidget({ toolName }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Feedback Form State
  const [feedbackType, setFeedbackType] = useState('Report Issue');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FEEDBACK_TYPES = [
    'Report Issue',
    'Suggest Improvement',
    'Request a New Tool',
    'Request a Guide',
    'Request a Feature',
    'Report Incorrect Result',
    'Contact Editorial Team'
  ];

  const handleRate = (value) => {
    setRating(value);
    toast.success(`You rated ${toolName} ${value} stars. Thank you!`);
  };

  const handleHelpful = (isHelpful) => {
    setFeedbackGiven(true);
    toast.success(isHelpful ? "Thanks for your positive feedback!" : "Thanks, we'll work on improving this tool.");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${toolName} | Toolisiya`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to PocketBase
    setTimeout(() => {
      console.log("Saving to PocketBase:", {
        toolName,
        type: feedbackType,
        message: feedbackMessage,
        browser: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFeedbackMessage('');
      toast.success("Feedback submitted successfully. Thank you!");
    }, 800);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mt-12 mb-8 shadow-sm relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Rating Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="font-bold text-foreground">Rate this tool</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRate(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Helpful Section */}
          <div className="flex flex-col items-center gap-3 border-y md:border-y-0 md:border-x border-border/50 py-6 md:py-0 md:px-8 w-full md:w-auto">
            <h3 className="font-bold text-foreground">Was this tool helpful?</h3>
            {feedbackGiven ? (
              <div className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full">
                Thank you for your feedback!
              </div>
            ) : (
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="rounded-full px-6" onClick={() => handleHelpful(true)}>
                  <ThumbsUp className="w-4 h-4 mr-2" /> Yes
                </Button>
                <Button variant="outline" size="sm" className="rounded-full px-6" onClick={() => handleHelpful(false)}>
                  <ThumbsDown className="w-4 h-4 mr-2" /> No
                </Button>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto justify-center">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" /> Share Tool
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => setIsModalOpen(true)}>
              <MessageSquarePlus className="w-4 h-4 mr-2" /> Send Feedback
            </Button>
          </div>

        </div>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border shadow-xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-primary" />
                Submit Feedback
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={submitFeedback} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">What kind of feedback do you have?</label>
                <select 
                  value={feedbackType} 
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {FEEDBACK_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Details (Optional but helpful)</label>
                <textarea 
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder={`Tell us more about your ${feedbackType.toLowerCase()}...`}
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
                <strong>Privacy Note:</strong> We collect your browser info and timestamp to help debug issues. Do not include personal information (PII) in your message.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Send Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
