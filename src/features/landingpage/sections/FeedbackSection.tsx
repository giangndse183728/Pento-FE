"use client";

import { memo, useState } from "react";
import ProfileCard from "@/components/decoration/ProfileCard";
import InfiniteScroll from "../components/InfiniteScroll";
import { AppDialog } from "@/components/decoration/AppDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorTheme } from "@/constants/color";

interface Feedback {
  name: string;
  title: string;
  rating: number;
  comment: string;
  avatar?: string;
}

const feedbackData: Feedback[] = [
  {
    name: "Sarah Johnson",
    title: "Mother of 3",
    rating: 5,
    comment: "Pento has completely transformed how I manage my household. The recipe suggestions are amazing!"
  },
  {
    name: "Michael Chen",
    title: "Chef",
    rating: 5,
    comment: "As a professional chef, I love how Pento helps me track my pantry and suggests creative recipes."
  },
  {
    name: "Emma Williams",
    title: "Health Enthusiast",
    rating: 5,
    comment: "The nutrition tracking feature is a game-changer. I can finally keep track of what my family eats."
  },
  {
    name: "David Martinez",
    title: "Busy Professional",
    rating: 5,
    comment: "The expiry tracking saved me so much money! No more wasted groceries."
  },
  {
    name: "Lisa Anderson",
    title: "Fitness Instructor",
    rating: 5,
    comment: "Love how Pento helps me meal plan with my family. The recipes are delicious and healthy."
  },
  {
    name: "James Taylor",
    title: "Cooking Enthusiast",
    rating: 5,
    comment: "The barcode scanning feature is incredibly convenient. Scanning and organizing has never been easier."
  },
];

function FeedbackSection() {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const feedbackItems = feedbackData.map((feedback, index) => ({
    content: (
      <div key={index} className="feedback-card">
        <div className="feedback-header">
          <div className="feedback-avatar">
            {feedback.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="feedback-info">
            <h4>{feedback.name}</h4>
            <p>{feedback.title}</p>
          </div>
        </div>
        <div className="feedback-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="star">★</span>
          ))}
        </div>
        <p className="feedback-comment">"{feedback.comment}"</p>
      </div>
    )
  }));

  const handleContactClick = () => {
    setIsContactDialogOpen(true);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, subject, message } = formData;
    
    if (!name || !subject || !message) {
      setSubmitError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success response
      console.log("Fake email sent:", { name, subject, message });

      // Success
      setSubmitSuccess(true);
      setFormData({
        name: "",
        subject: "",
        message: "",
      });

      // Close dialog after 2 seconds
      setTimeout(() => {
        setIsContactDialogOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to send email. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="feedback-section"
      className="min-h-screen w-screen flex-shrink-0 flex items-center justify-center bg-gradient-to-b from-blue-200/50 to-black/70 snap-start relative"
    >
      
      <div className="w-full h-full grid grid-cols-[45%_20%_35%] items-center relative z-10">
        <div className="w-full h-full flex items-center justify-center pr-16">
          <InfiniteScroll 
            negativeMargin="-6em"
            tiltDirection="right"
            items={feedbackItems}
            width="100%"
            maxHeight="100vh"
            itemMinHeight={250}
            autoplay={true}
            autoplaySpeed={1}
            autoplayDirection="down"
            pauseOnHover={true}
          />
        </div>

        <div className="w-full h-full">
        </div>
        <div className="w-full h-2/3 pr-16 flex flex-col items-center justify-center gap-6">
          <ProfileCard
            avatarUrl="/assets/img/banner.png"
            name="PENTO"
            title="Admin"
            handle="pento.admin"
            status="Active"
            showUserInfo={true}
            enableTilt={true}
            miniAvatarUrl="/logo2.png"
            contactText="Contact Us"
            onContactClick={handleContactClick}
          />
                
          <div className="flex flex-row gap-4 w-full max-w-md mb-12">
            <button className="flex items-center space-x-3 px-6 py-4 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-black/50 transition-all duration-300 text-left flex-1">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-sm text-gray-300">Download on</div>
                <div className="text-base font-semibold text-white">App Store</div>
              </div>
            </button>
            <button className="flex items-center space-x-3 px-6 py-4 bg-[#3DDC84]/30 backdrop-blur-sm rounded-2xl border border-[#3DDC84]/40 hover:bg-[#3DDC84]/40 transition-all duration-300 text-left flex-1">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-sm text-gray-300">Get it on</div>
                <div className="text-base font-semibold text-white">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <AppDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
        title="Contact Us"
        maxWidth={500}
        padding={24}
        borderRadius={20}
        borderColor={ColorTheme.powderBlue}
        borderWidth={4}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {submitSuccess && (
            <div
              className="p-3 rounded-md text-sm"
              style={{
                backgroundColor: ColorTheme.babyBlue,
                color: ColorTheme.darkBlue,
                border: `1px solid ${ColorTheme.blueGray}`,
              }}
            >
              ✓ Email sent successfully! We'll get back to you soon.
            </div>
          )}
          {submitError && (
            <div
              className="p-3 rounded-md text-sm"
              style={{
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
              }}
            >
              ✗ {submitError}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium" style={{ color: ColorTheme.darkBlue }}>
              Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              disabled={isSubmitting || submitSuccess}
              style={{
                backgroundColor: ColorTheme.iceberg,
                color: ColorTheme.darkBlue,
                borderColor: ColorTheme.powderBlue,
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm font-medium" style={{ color: ColorTheme.darkBlue }}>
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What is this regarding?"
              required
              disabled={isSubmitting || submitSuccess}
              style={{
                backgroundColor: ColorTheme.iceberg,
                color: ColorTheme.darkBlue,
                borderColor: ColorTheme.powderBlue,
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium" style={{ color: ColorTheme.darkBlue }}>
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message..."
              required
              rows={5}
              disabled={isSubmitting || submitSuccess}
              className="w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus:ring-[2px] resize-none disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: ColorTheme.iceberg,
                color: ColorTheme.darkBlue,
                borderColor: ColorTheme.powderBlue,
              }}
              onFocus={(e) => {
                if (!e.target.disabled) {
                  e.target.style.borderColor = ColorTheme.blueGray;
                  e.target.style.boxShadow = `0 0 0 2px ${ColorTheme.powderBlue}40`;
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = ColorTheme.powderBlue;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsContactDialogOpen(false);
                setSubmitError(null);
                setSubmitSuccess(false);
              }}
              className="flex-1"
              disabled={isSubmitting}
              style={{
                borderColor: ColorTheme.powderBlue,
                color: ColorTheme.darkBlue,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || submitSuccess}
              style={{
                backgroundColor: ColorTheme.blueGray,
                color: ColorTheme.iceberg,
                opacity: isSubmitting || submitSuccess ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Sending..." : submitSuccess ? "Sent!" : "Send Email"}
            </Button>
          </div>
        </form>
      </AppDialog>
      
    </div>
    
  );
}

export default memo(FeedbackSection);
