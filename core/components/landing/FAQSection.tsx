"use client";

// components/FAQSection.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Inviteera and how does it work?",
    answer:
      "Inviteera is an online invitation maker that helps you design, send, and manage event invitations quickly and easily — with no design skills needed. Choose a template, customize it, send it, and track RSVPs in one place.",
  },
  {
    question: "Do I need design skills to create invitations?",
    answer:
      "No! Inviteera uses an intuitive drag-and-drop editor and ready-made templates, so you can create beautiful invitations even without any design expertise.",
  },
  {
    question: "What types of events can I make invitations for?",
    answer:
      "You can create invitations for weddings, birthdays, corporate events, parties, and more — basically any special occasion that needs an invite.",
  },
  {
    question: "How do I send invitations to my guests?",
    answer:
      "You can instantly share invitations via email, SMS, or social media links, making it easy for guests to view and RSVP.",
  },
  {
    question: "Can I track RSVPs and guest responses?",
    answer:
      "Yes! Inviteera lets you track RSVP responses in real time and manage your guest list — including preferences and plus-ones — all from your dashboard.",
  },
  {
    question: "Are there templates available?",
    answer:
      "Absolutely — there are hundreds of professionally designed templates for every kind of event and style, so you don’t have to start from scratch.",
  },
  {
    question: "Is Inviteera free to use?",
    answer:
      "Inviteera offers a free starter option, and premium plans with more designs and features are available in the Pricing section of the site.",
  },
  {
    question: "Can I organize multiple events?",
    answer:
      "Yes — Inviteera helps you keep all your events organized with calendars and reminders so you never miss an important date.",
  },
  {
    question: "Are my invitations secure?",
    answer:
      "Yes — invitations and guest data are handled securely, and you can send them only to the guests you choose.",
  },
  {
    question: "What kind of support can I expect?",
    answer:
      "Inviteera provides help documentation and support options to assist you with features, technical issues, or billing questions.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-600">
            Everything you need to know about creating and managing invitations with Inviteera.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="bg-white border shadow-sm hover:shadow-md transition-all duration-300"
              style={{ borderColor: 'var(--color-border)' }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={22} style={{ color: 'var(--color-accent-primary)' }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
