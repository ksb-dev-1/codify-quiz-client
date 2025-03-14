"use client";

import { useState } from "react";
import Link from "next/link";

// types
import { Question } from "@/types/types";

// lib
import fetchQuestion from "@/lib/fetchQuestion";
import changeQuestionStatus from "@/lib/changeQuestionStatus";

// components
import QuestionDetailSkeleton from "@/components/skeletons/QuestionDetailSkeleton";
import CodeSnippetRenderer from "@/components/CodeSnippetRenderer";
import ToggleSaveQuestionButton from "@/components/ToggleSaveQuestionButton";

// 3rd party
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoArrowBackOutline } from "react-icons/io5";
import { GrCheckbox, GrCheckboxSelected, GrPowerReset } from "react-icons/gr";
import { QuestionStatusEnum } from "@prisma/client";

export default function QuestionDetail({ questionId }: { questionId: string }) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => fetchQuestion(questionId),
  });

  // Mark question status as attempted
  const markStatusAsAttemptedMutation = useMutation({
    mutationFn: () => changeQuestionStatus(questionId, "ATTEMPTED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
      queryClient.invalidateQueries({ queryKey: ["question"] });
      queryClient.invalidateQueries({ queryKey: ["saved-questions"] });
      queryClient.invalidateQueries({ queryKey: ["question-count"] });
      //toast.success("Question status set as attempted");
    },
    onError: () => toast.error("Failed to set status as attempted"),
  });

  // Mark question status as solved
  const markStatusAsSolvedMutation = useMutation({
    mutationFn: () => changeQuestionStatus(questionId, "SOLVED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
      queryClient.invalidateQueries({ queryKey: ["question"] });
      queryClient.invalidateQueries({ queryKey: ["saved-questions"] });
      queryClient.invalidateQueries({ queryKey: ["question-count"] });
      //toast.success("Question status set as solved");
    },
    onError: () => toast.error("Failed to set status as attempted"),
  });

  if (isLoading) {
    return <QuestionDetailSkeleton />;
  }

  if (!data?.question || isError) {
    return <p className="text-xl">No question found!</p>;
  }

  const questionData: {
    success: boolean;
    question: Question;
    isSaved: boolean;
    status: QuestionStatusEnum;
  } = data;

  const {
    id,
    qNo,
    question,
    codeSnippet,
    correctOption,
    options,
    explanation,
  } = questionData.question;
  const status = questionData.status;
  const isSaved = questionData.isSaved;

  const handleOptionClick = (option: string) => {
    setSubmitted(false);
    if (status === "SOLVED" || (submitted && isCorrect)) return; // ✅ Prevent changing after correct answer
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) {
      toast.error("Please select an option.");
      return;
    }

    if (status !== "ATTEMPTED") {
      markStatusAsAttemptedMutation.mutate();
    }

    setSubmitted(true);

    if (selectedOption === correctOption) {
      toast.success("Correct Answer!");
      setIsCorrect(true);
    } else {
      toast.error("Wrong answer! Try again.");
      setIsCorrect(false);
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setSelectedOption("");
    setIsCorrect(false);
  };

  const handleMarkAsCompleted = () => {
    markStatusAsSolvedMutation.mutate();
  };

  const handleUnmarkAsCompleted = () => {
    markStatusAsAttemptedMutation.mutate();

    setSubmitted(false);
    setSelectedOption("");
    setIsCorrect(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/pages/questions?page=1"
          className="flex items-center text-blue-600 underline"
        >
          <IoArrowBackOutline />
          <span className="ml-2">Back to Questions</span>
        </Link>

        <ToggleSaveQuestionButton questionId={id} isSaved={isSaved} />
      </div>

      <div className="mt-4 border p-4 sm:p-8 rounded-custom">
        <p>
          <span className="font-medium mr-1">{qNo}.</span>
          {question || "No question available."}
        </p>

        {/* Code Snippet */}
        {codeSnippet && (
          <div className="mt-4 rounded-custom border overflow-hidden">
            <CodeSnippetRenderer code={codeSnippet} />
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {Object.entries(options).map(([key, value]) => {
            let bgColor =
              !isCorrect && status !== "SOLVED"
                ? "hover:bg-slate-200 cursor-pointer"
                : "cursor-not-allowed";

            if (status === "SOLVED" && key === correctOption) {
              bgColor = "bg-emerald-700 text-white cursor-not-allowed";
            }

            if (submitted) {
              if (key === selectedOption) {
                bgColor =
                  selectedOption === correctOption
                    ? "bg-emerald-700 text-white"
                    : "bg-red-600 text-white";
              }
            } else if (key === selectedOption) {
              bgColor = "bg-blue-600 text-white";
            }

            return (
              <button
                key={key}
                onClick={() => handleOptionClick(key)}
                className={`text-start border rounded-custom px-4 py-2 transition-colors ${bgColor}`}
                disabled={status === "SOLVED" || (submitted && isCorrect)} // ✅ Prevent changes after correct answer
              >
                <span className="font-bold">{key.toUpperCase()}:</span>{" "}
                {value as React.ReactNode}
              </button>
            );
          })}
        </div>

        {/* Buttons Section */}
        {status === "SOLVED" ? (
          // Show "Unmark as Completed" button if question is completed
          <>
            {markStatusAsAttemptedMutation.isPending ? (
              <div className="mt-8 flex items-center ">
                <span className="skeleton text-transparent w-5 h-5 mr-2" />
                <span>Unchecking...</span>
              </div>
            ) : (
              <button
                onClick={handleUnmarkAsCompleted}
                className="mt-8 flex items-center hover:text-emerald-700 transition-colors"
              >
                <GrCheckboxSelected className="text-emerald-700 w-5 h-5 mr-2" />
                <span>Uncheck as completed</span>
              </button>
            )}
          </>
        ) : (
          <>
            {/* Show Submit button if user hasn't answered correctly */}
            {!isCorrect && (
              <button
                onClick={handleSubmitAnswer}
                className="w-full mt-4 px-4 py-2 rounded-custom border border-primary bg-primary text-white hover:bg-hover transition-colors"
              >
                Submit
              </button>
            )}

            {/* If correct answer is submitted, show Check as Completed and Reset options */}
            {submitted && isCorrect && (
              <div className="mt-8 flex items-center justify-between">
                {markStatusAsSolvedMutation.isPending ? (
                  <div className="flex items-center">
                    <span className="skeleton text-transparent w-5 h-5 mr-2" />
                    <span>Checking...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleMarkAsCompleted}
                    className="flex items-center hover:text-emerald-700 transition-colors"
                  >
                    <GrCheckbox className="text-emerald-700 w-5 h-5 mr-2" />
                    <span>Check as completed</span>
                  </button>
                )}
                <button
                  onClick={handleTryAgain}
                  className="flex items-center hover:text-hover transition-colors"
                >
                  <span className="inline-block mr-2">
                    <GrPowerReset />
                  </span>
                  <span>Reset</span>
                </button>
              </div>
            )}
          </>
        )}

        {status === "SOLVED" && explanation && (
          <div className="mt-8 bg-green-100 border border-emerald-700 rounded-custom p-4 sm:p-8 text-emerald-700">
            <p className="font-semibold mb-2 text-xl">Explanation</p>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
