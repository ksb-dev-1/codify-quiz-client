"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// hooks
import { useHandleOutsideClick } from "@/hooks/useHandleOutsideClick";

// lib
import fetchQuestions from "@/lib/fetchQuestions";
import fetchTopics from "@/lib/fetchTopics";

// components
import Filter from "@/components/Filter";
import FilterTags from "@/components/FilterTags";
import QuestionList from "@/components/QuestionList";
import Pagination from "@/components/Pagination";

// 3rd party
import { useSession } from "next-auth/react";
import { useQueries } from "@tanstack/react-query";
import { IoFilter } from "react-icons/io5";
import { Loader2 } from "lucide-react";

// interface QuestionsProps {
//   currentPage: string | undefined;
//   currentStatus: string | undefined;
//   currentDifficulty: string | undefined;
//   currentTopic: string | undefined;
// }

export default function QuestionListWrapper() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || "1"; // Get query parameter "name"
  const currentStatus = searchParams.get("status") || "";
  const currentDifficulty = searchParams.get("difficulty") || "";
  const currentTopic = searchParams.get("topic") || "";

  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "loading" && !userId) router.push("/pages/signin");
  }, [status, userId, router]);

  useHandleOutsideClick(filterRef, setIsFilterOpen);

  // To handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 786 && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [isFilterOpen]);

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
        enabled: !!userId,
      },
      {
        queryKey: ["topics", userId],
        queryFn: () => fetchTopics(userId),
        enabled: !!userId,
      },
    ],
  });

  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

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
    <>
      <div className="w-full flex flex-col items-start">
        <div className="w-full flex items-start">
          <div className="sticky top-[9rem] hidden md:flex flex-col items-start max-w-72 w-full mr-8 border rounded-custom p-6">
            {/* Filter */}
            <Filter
              currentStatus={currentStatus}
              currentDifficulty={currentDifficulty}
              topicsData={topicsData}
              topicsLoading={topicsLoading}
              topicsError={topicsError}
              currentTopic={currentTopic}
              //isFilterApplied={isFilterApplied}
            />
          </div>

          <div className="w-full flex flex-col items-end">
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
        </div>
      </div>
      {/* Filter button for small screen */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="fixed bottom-8 right-8 px-4 py-2 bg-primary border-2 border-white text-white rounded-custom flex md:hidden items-center hover:bg-hover transition-colors"
      >
        <IoFilter className="mr-2 text-xl" />
        <span>Filter</span>
      </button>

      {/* Filter for smaller screen */}
      <div
        className={`${
          isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity fixed z-20 top-0 left-0 right-0 bottom-0 bg-[rgb(0,30,43,0.5)] flex flex-col justify-end`}
      >
        <div
          ref={filterRef}
          className={`${
            isFilterOpen ? "translate-y-0" : "translate-y-[100%]"
          } bg-white rounded-custom p-8 transition-transform duration-300`}
        >
          <Filter
            currentStatus={currentStatus}
            currentDifficulty={currentDifficulty}
            topicsData={topicsData}
            topicsLoading={topicsLoading}
            topicsError={topicsError}
            currentTopic={currentTopic}
            setIsFilterOpen={setIsFilterOpen}
          />
        </div>
      </div>
    </>
  );
}
