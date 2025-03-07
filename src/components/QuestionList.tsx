"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// constants
import { getStatusIcon } from "@/constants/statuses";

// types
import { Question } from "@/types/types";

// components
import QuestionListSkeleton from "@/components/skeletons/QuestionListSkeleton";
import QuestionsHeader from "@/components/shared/QuestionsHeader";
import SaveRemoveButton from "./SaveRemoveButton";

interface QuestionListProps {
  questionsLoading: boolean;
  questionsError: boolean;
  questions: Question[];
  isFilterApplied: boolean;
}

export default function QuestionList({
  questionsLoading,
  questionsError,
  questions,
  isFilterApplied,
}: QuestionListProps) {
  const [optimisticQuestions, setOptimisticQuestions] = useState(questions);

  useEffect(() => {
    setOptimisticQuestions(questions);
  }, [questions]); // 🔥 Updates state whenever `questions` prop changes

  const handleSave = (questionID: string) => {
    setOptimisticQuestions((prev) =>
      prev.map((q) => (q.id === questionID ? { ...q, isSaved: true } : q))
    );
  };

  const handleRemove = (questionID: string) => {
    setOptimisticQuestions((prev) =>
      prev.map((q) => (q.id === questionID ? { ...q, isSaved: false } : q))
    );
  };

  if (questionsLoading || optimisticQuestions.length === 0) {
    return <QuestionListSkeleton text="Questions" marginTop="mt-8" />;
  }

  if (questionsError) {
    return (
      <p className="mt-8 text-center text-red-600 text-xl">
        Failed to fetch questions! Refresh the page or check your internet
        connection.
      </p>
    );
  }

  if (optimisticQuestions.length === 0 && !isFilterApplied) {
    return <p className="text-xl mt-8">No questions found!</p>;
  }

  if (optimisticQuestions.length === 0 && isFilterApplied) {
    return (
      <p className="text-xl mt-8">
        No questions found! Try using different filters.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <QuestionsHeader text="Questions" />
      <div>
        {optimisticQuestions.map(
          ({ id, qNo, status, topicName, difficulty, isSaved }) => {
            const StatusIcon = getStatusIcon(status);

            // Define colors statically
            let statusIconColor = "";

            if (status === "TODO") {
              statusIconColor = "text-blue-600";
            } else if (status === "SOLVED") {
              statusIconColor = "text-emerald-700";
            } else if (status === "ATTEMPTED") {
              statusIconColor = "text-orange-600";
            }

            // Define colors statically
            let difficultyTextColor = "";

            if (difficulty === "EASY") {
              difficultyTextColor = "text-teal-700";
            } else if (difficulty === "MEDIUM") {
              difficultyTextColor = "text-yellow-700";
            } else if (difficulty === "HARD") {
              difficultyTextColor = "text-red-600";
            }

            return (
              <div
                key={id}
                className="w-full my-4 rounded-custom border p-4 sm:p-6 flex flex-row justify-between sm:justify-normal"
              >
                <div className="w-full sm:w-[calc(100%-97.27px+3rem+87.38px+2rem)] flex sm:items-center flex-col-reverse sm:flex-row justify-between sm:justify-normal">
                  {/* Status */}
                  <span className="sm:w-[calc(97.27px+3rem)] flex items-center">
                    {StatusIcon && (
                      <StatusIcon
                        className={`text-xl mr-2 ${statusIconColor}`}
                      />
                    )}
                    <span>
                      {status.charAt(0) + status.substring(1).toLowerCase()}
                    </span>
                  </span>

                  {/* Topic */}
                  <div className="sm:w-[calc(100%-97.28px+4rem)]">
                    <div className="w-fit flex items-cente">
                      <span className="mr-1 font-medium">{qNo}.</span>
                      <Link
                        href={`/pages/questions/${id}`}
                        className=" text-blue-600 underline"
                      >
                        {topicName}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="sm:w-[calc(55.38px+32px+2rem)] sm:mt-0 flex flex-col sm:flex-row items-end sm:items-center justify-between sm:justify-normal">
                  {/* Difficulty */}
                  <span
                    className={`sm:w-[calc(55.38px)] flex justify-end ${difficultyTextColor}`}
                  >
                    {difficulty.charAt(0) +
                      difficulty.substring(1).toLowerCase()}
                  </span>

                  <SaveRemoveButton
                    questionId={id}
                    isSaved={isSaved}
                    onSave={handleSave}
                    onRemove={handleRemove}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
