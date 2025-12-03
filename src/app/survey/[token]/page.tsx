"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPublicSurvey, submitSurveyResponse } from "@/actions/survey-actions";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Smile, ThumbsUp, BarChartHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  text: string;
  type: "text" | "rating" | "emoji" | "thumbs" | "likert" | "multiple";
  required?: boolean;
}

export default function PublicSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [survey, setSurvey] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respondentName, setRespondentName] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");

  useEffect(() => {
    loadSurvey();
  }, [token]);

  const loadSurvey = async () => {
    setLoading(true);
    const result = await getPublicSurvey(token);
    
    if (result.success) {
      setSurvey(result.survey);
    } else {
      toast.error(result.error || "Survey not found");
    }
    setLoading(false);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    const questions = survey.questions as Question[];
    const currentQ = questions[currentQuestion];
    
    if (currentQ.required && !answers[currentQ.id]) {
      toast.error("This question is required");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const questions = survey.questions as Question[];
    
    // Validate required questions
    for (const q of questions) {
      if (q.required && !answers[q.id]) {
        toast.error(`Please answer: ${q.text}`);
        return;
      }
    }

    setSubmitting(true);

    // Format answers
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const result = await submitSurveyResponse(token, {
      answers: formattedAnswers,
      respondent: respondentEmail || undefined,
      respondentName: respondentName || undefined,
      ipAddress: undefined, // Can be captured server-side
      userAgent: navigator.userAgent,
    });

    if (result.success) {
      setSubmitted(true);
      toast.success("Thank you for your response!");
    } else {
      toast.error(result.error || "Failed to submit response");
    }

    setSubmitting(false);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "text":
        return (
          <Textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-[120px] text-base"
          />
        );

      case "rating":
        return (
          <div className="flex gap-2 flex-wrap justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => handleAnswerChange(question.id, num)}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  answers[question.id] === num
                    ? "bg-indigo-600 border-indigo-600 text-white scale-110"
                    : "border-gray-300 hover:border-indigo-400 hover:scale-105"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        );

      case "emoji":
        const emojis = ["😡", "🙁", "😐", "🙂", "😃"];
        return (
          <div className="flex gap-6 justify-center">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleAnswerChange(question.id, index + 1)}
                className={`text-5xl transition-all hover:scale-125 ${
                  answers[question.id] === index + 1 ? "scale-125" : "opacity-60"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        );

      case "thumbs":
        return (
          <div className="flex gap-12 justify-center">
            <button
              onClick={() => handleAnswerChange(question.id, "down")}
              className={`text-6xl transition-all hover:scale-110 ${
                answers[question.id] === "down" ? "scale-110" : "opacity-60"
              }`}
            >
              👎
            </button>
            <button
              onClick={() => handleAnswerChange(question.id, "up")}
              className={`text-6xl transition-all hover:scale-110 ${
                answers[question.id] === "up" ? "scale-110" : "opacity-60"
              }`}
            >
              👍
            </button>
          </div>
        );

      case "likert":
        const likertOptions = [
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree",
        ];
        return (
          <div className="space-y-3">
            {likertOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerChange(question.id, index + 1)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  answers[question.id] === index + 1
                    ? "bg-indigo-50 border-indigo-600 text-indigo-900"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Survey Not Found</h1>
          <p className="text-gray-600">This survey may have been closed or removed.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-gray-600 text-lg">
            Your response has been recorded successfully.
          </p>
        </motion.div>
      </div>
    );
  }

  const questions = survey.questions as Question[];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600">{survey.description}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {questions[currentQuestion].text}
                {questions[currentQuestion].required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h2>
            </div>

            {renderQuestion(questions[currentQuestion])}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
          >
            Previous
          </Button>

          {currentQuestion < questions.length - 1 ? (
            <Button onClick={handleNext} size="lg">
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Response"
              )}
            </Button>
          )}
        </div>

        {/* Optional Contact Info */}
        {currentQuestion === questions.length - 1 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Optional: Share your contact info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your name"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Your email"
                value={respondentEmail}
                onChange={(e) => setRespondentEmail(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
