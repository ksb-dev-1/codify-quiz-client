"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// types
import { Topic } from "@/types/types";

// components
import DifficultyFilter from "./DifficultyFilter";
import StatusFilter from "./StatusFilter";
import TopicsFilter from "./TopicsFilter";

interface FilterProps {
  currentStatus: string | undefined;
  currentDifficulty: string | undefined;
  topicsData: { topics: Topic[] };
  topicsLoading: boolean;
  topicsError: boolean;
  currentTopic: string | undefined;
  setIsFilterOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function Filter({
  currentStatus,
  currentDifficulty,
  topicsData,
  topicsLoading,
  topicsError,
  currentTopic,
  setIsFilterOpen,
}: FilterProps) {
  const [status, setStatus] = useState<string | undefined>(currentStatus);
  const [difficulty, setDifficulty] = useState<string | undefined>(
    currentDifficulty
  );
  const [topic, setTopic] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const newParams = new URLSearchParams(searchParams.toString());

  const isFilters = status || difficulty || topic ? true : false;

  useEffect(() => {
    setStatus(currentStatus);
    setDifficulty(currentDifficulty);
    setTopic(currentTopic);
  }, [currentStatus, currentDifficulty, currentTopic]);

  const handleSubmit = () => {
    if (status) newParams.set("status", status);
    else newParams.delete("status");
    if (difficulty) newParams.set("difficulty", difficulty);
    else newParams.delete("difficulty");
    if (topic) newParams.set("topic", topic);
    else newParams.delete("topic");

    newParams.set("page", "1");

    if (setIsFilterOpen) {
      setIsFilterOpen(false);
    }

    router.push(`?${newParams.toString()}`);
  };

  return (
    <>
      <StatusFilter passedStatus={status} setStatus={setStatus} />
      <DifficultyFilter
        passedDifficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <TopicsFilter
        topicsLoading={topicsLoading}
        topicsError={topicsError}
        topicsData={topicsData}
        passedTopic={topic}
        setTopic={setTopic}
      />
      <button
        onClick={handleSubmit}
        className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-custom ${
          !isFilters
            ? "bg-[#999] cursor-not-allowed"
            : "bg-primary hover:bg-hover"
        } text-white  transition-colors`}
      >
        Apply Filters
      </button>
    </>
  );
}
