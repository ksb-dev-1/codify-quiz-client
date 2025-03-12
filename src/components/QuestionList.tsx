"use client";

import Link from "next/link";

// constants
import { getStatusColor, getStatusIcon } from "@/constants/statuses";
import { getDifficultyColor } from "@/constants/difficulties";

// types
import { Question } from "@/types/types";

// components
import QuestionListSkeleton from "@/components/skeletons/QuestionListSkeleton";
import QuestionsHeader from "@/components/shared/QuestionsHeader";
import ToggleSaveQuestionButton from "./ToggleSaveQuestionButton";

type QuestionListProps = {
  questionsLoading: boolean;
  questionsError: boolean;
  questions: Question[];
  isFilterApplied: boolean;
};

export default function QuestionList({
  questionsLoading,
  questionsError,
  questions,
  isFilterApplied,
}: QuestionListProps) {
  if (questionsLoading) {
    return (
      <QuestionListSkeleton
        text="Questions"
        marginTop={isFilterApplied ? "mt-8" : ""}
      />
    );
  }

  if (questionsError) {
    return (
      <p className="mt-8 text-center text-red-600 text-xl">
        Failed to fetch questions! Refresh the page or check your internet
        connection.
      </p>
    );
  }

  if (questions.length === 0 && !isFilterApplied) {
    return <p className="text-xl mt-8">No questions found!</p>;
  }

  if (questions.length === 0 && isFilterApplied) {
    return (
      <p className="text-center text-xl mt-8">
        No questions found! Try using different filters.
      </p>
    );
  }

  return (
    <div>
      <QuestionsHeader
        text="Questions"
        marginTop={isFilterApplied ? "mt-8" : ""}
      />
      <div className="bg-white rounded-custom">
        {questions.map(
          ({ id, qNo, status, topicName, difficulty, isSaved }) => {
            const StatusIcon = getStatusIcon(status);

            const statusIconColor = getStatusColor(status);
            const difficultyTextColor = getDifficultyColor(difficulty);

            return (
              <div
                key={id}
                className="border-b w-full p-4 sm:p-6 flex flex-row justify-between sm:justify-normal"
              >
                <div className="w-full flex sm:items-center flex-col-reverse sm:flex-row justify-between sm:justify-normal">
                  {/* Status */}
                  <span className="sm:w-[calc(42.85px+2rem)] flex items-center">
                    {StatusIcon && (
                      <StatusIcon
                        className={`text-xl mr-2 ${statusIconColor}`}
                      />
                    )}
                  </span>

                  {/* Topic */}
                  <div className="sm:w-full">
                    <div className="w-fit flex items-cente">
                      <span className="mr-2">{qNo}.</span>
                      <Link
                        href={`/pages/questions/${id}`}
                        className="text-blue-700 underline"
                      >
                        {topicName}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="sm:mt-0 flex flex-col sm:flex-row items-end sm:items-center justify-between sm:justify-normal">
                  {/* Difficulty */}
                  <span
                    className={`sm:w-[calc(64.81px+2rem)] flex justify-end ${difficultyTextColor}`}
                  >
                    {difficulty.charAt(0) +
                      difficulty.substring(1).toLowerCase()}
                  </span>

                  <span className="sm:w-[calc(34.55px+2rem)] flex justify-end">
                    <ToggleSaveQuestionButton
                      questionId={id}
                      marginTop="mt-6"
                      isSaved={isSaved}
                    />
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
