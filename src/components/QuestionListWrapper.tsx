"use client";

// lib
import fetchQuestions from "@/lib/fetchQuestions";
import fetchTopics from "@/lib/fetchTopics";

// components
import StatusFilter from "@/components/StatusFilter";
import DifficultyFilter from "@/components/DifficultyFilter";
import TopicsFilter from "@/components/TopicsFilter";
import FilterTags from "@/components/FilterTags";
import QuestionList from "@/components/QuestionList";
import Pagination from "@/components/Pagination";

// 3rd party
import { useQueries } from "@tanstack/react-query";

interface QuestionsProps {
  userId: string;
  currentPage: string | undefined;
  currentStatus: string | undefined;
  currentDifficulty: string | undefined;
  currentTopic: string | undefined;
}

export default function QuestionListWrapper({
  userId,
  currentPage,
  currentStatus,
  currentDifficulty,
  currentTopic,
}: QuestionsProps) {
  // Parallelly fetch questions and topics
  const [questionsQuery, topicsQuery] = useQueries({
    queries: [
      {
        queryKey: [
          "questions",
          userId,
          currentPage,
          currentStatus,
          currentDifficulty,
          currentTopic,
        ],
        queryFn: () =>
          fetchQuestions(
            userId,
            currentPage,
            currentStatus,
            currentDifficulty,
            currentTopic
          ),
      },
      {
        queryKey: ["topics", userId],
        queryFn: () => fetchTopics(userId),
      },
    ],
  });

  const questionsLoading = questionsQuery.isLoading;
  const questionsError = questionsQuery.isError;
  const questionsData = questionsQuery.data;
  const questions = questionsData?.questions || [];
  const totalPages = questionsData?.totalPages || 1;

  const topicsLoading = topicsQuery.isLoading;
  const topicsError = topicsQuery.isError;
  const topicsData = topicsQuery.data;

  const isFilterApplied =
    currentStatus || currentDifficulty || currentTopic ? true : false;

  return (
    <div className="w-full flex flex-col items-start">
      {/* Filters */}
      {!questionsError && (
        <div className="w-full grid md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <StatusFilter />
            <DifficultyFilter />
          </div>
          {topicsLoading ? (
            <div className="skeleton w-full px-4 py-2 rounded-custom border border-transparent text-transparent">
              skeleton
            </div>
          ) : (
            <TopicsFilter
              topicsData={topicsData}
              topicsLoading={topicsLoading}
              topicsError={topicsError}
            />
          )}
        </div>
      )}

      <div className="w-full">
        {/* Filter Tags */}
        {(currentStatus || currentDifficulty || currentTopic) && (
          <FilterTags
            currentStatus={currentStatus}
            currentDifficulty={currentDifficulty}
            currentTopic={currentTopic}
          />
        )}

        {/* Question List*/}
        <QuestionList
          questionsLoading={questionsLoading}
          questionsError={questionsError}
          questions={questions}
          isFilterApplied={isFilterApplied}
        />
      </div>

      {/* Pagination */}
      {!questionsError && totalPages > 1 && (
        <Pagination
          questionsLoading={questionsLoading}
          currentPage={Number(currentPage)}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
