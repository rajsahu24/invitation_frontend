'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Loader2, ArrowRight } from 'lucide-react';

interface Question {
  type: 'dropdown' | 'short_answer';
  question: string;
  options?: string[];
}

interface Props {
  invitationId: string;
  eventId?: string;
  eventData?: any;
  onCancel: () => void;
}

export default function EventForm({ invitationId, eventId, eventData, onCancel }: Props) {
  const [formData, setFormData] = useState({
    name: eventData?.name || '',
    start_time: eventData?.start_time ? new Date(eventData.start_time).toISOString().slice(0, 16) : '',
    location: eventData?.event_location || eventData?.location || '',
    description: eventData?.description || ''
  });
  const [questions, setQuestions] = useState<Question[]>(eventData?.metadata?.questionnaire || []);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    type: 'short_answer',
    question: '',
    options: []
  });
  const [newOption, setNewOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (newOption.trim()) {
      setNewQuestion({
        ...newQuestion,
        options: [...(newQuestion.options || []), newOption]
      });
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options?.filter((_, i) => i !== index)
    });
  };

  const addQuestion = () => {
    if (newQuestion.question.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({ type: 'short_answer', question: '', options: [] });
      setShowAddQuestion(false);
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = eventId 
        ? `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/events/${eventId}`
        : `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/events`;
      
      const response = await fetch(url, {
        method: eventId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          invitation_id: invitationId,
          name: formData.name,
          start_time: formData.start_time,
          event_location: formData.location,
          description: formData.description,
          metadata: { questionnaire: questions }
        })
      });

      if (response.ok) {
        onCancel();
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto" onClick={onCancel}>
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onCancel}
          className="mb-2 flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <motion.div 
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 px-8 py-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{eventId ? 'Update Event' : 'Create Event'}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Event Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Wedding Ceremony"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date & Time</label>
                <input 
                  type="datetime-local" 
                  required
                  value={formData.start_time}
                  onChange={e => setFormData({...formData, start_time: e.target.value})}
                  className="w-full px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="Event location"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                placeholder="Event description (optional)"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 text-black rounded-xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">RSVP Questionnaire</label>
              <p className="text-xs text-gray-500 mb-4">Ask guests questions when they RSVP. Collect emails, dietary restrictions, anything!</p>

              <button
                type="button"
                onClick={() => setShowAddQuestion(!showAddQuestion)}
                className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium mb-4"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>

              {showAddQuestion && (
                <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-3">
                  <select
                    value={newQuestion.type}
                    onChange={e => setNewQuestion({...newQuestion, type: e.target.value as 'dropdown' | 'short_answer', options: []})}
                    className="w-full px-3 py-2 text-black rounded-lg border border-gray-200 focus:border-violet-500 outline-none"
                  >
                    <option value="short_answer">Short Answer</option>
                    <option value="dropdown">Dropdown</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Enter your question"
                    value={newQuestion.question}
                    onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                    className="w-full px-3 py-2 text-black rounded-lg border border-gray-200 focus:border-violet-500 outline-none"
                  />

                  {newQuestion.type === 'dropdown' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add option"
                          value={newOption}
                          onChange={e => setNewOption(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addOption())}
                          className="flex-1 px-3 py-2 text-black rounded-lg border border-gray-200 focus:border-violet-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={addOption}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {newQuestion.options && newQuestion.options.length > 0 && (
                        <div className="space-y-1">
                          {newQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center text-black justify-between bg-white p-2 rounded">
                              <span className="text-sm">{option}</span>
                              <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm"
                  >
                    Add Question
                  </button>
                </div>
              )}

              {questions.length > 0 && (
                <div className="space-y-2">
                  {questions.map((q, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-violet-600 uppercase">{q.type.replace('_', ' ')}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{q.question}</p>
                          {q.options && q.options.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              Options: {q.options.join(', ')}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.start_time || !formData.location}
                className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {eventId ? 'Update Event' : 'Create Event'} <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
