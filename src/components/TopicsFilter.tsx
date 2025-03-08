"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// 3rd party
import { Topic } from "@/types/types";
import { FaChevronDown } from "react-icons/fa6";

interface TopicsFilterProps {
  topicsData: { topics: Topic[] };
  topicsLoading: boolean;
  topicsError: boolean;
  currentTopic: string | undefined;
}

export default function TopicsFilter({
  topicsData,
  topicsLoading,
  topicsError,
  currentTopic,
}: TopicsFilterProps) {
  const [more, setMore] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const topics = topicsData?.topics || [];
  const displayedTopics = more ? topics : topics.slice(0, 3); // Show only 5 initially

  return (
    <div className="mt-8 relative w-full">
      <p className="font-semibold text-xl mb-4">Topics</p>
      <div>
        {/* Error State */}
        {!topicsLoading && topicsError && (
          <div className="text-red-600 p-2 text-center w-full">
            Failed to fetch topics! Please refresh the page.
          </div>
        )}

        {/* No Topics Found */}
        {!topicsLoading && !topicsError && topics.length === 0 && (
          <div className="p-2 text-center w-full">No topics found!</div>
        )}

        {/* Loading Skeleton */}
        <div className="w-full flex items-center flex-wrap gap-4">
          {topicsLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <span
                key={index}
                className="skeleton px-2 py-1 border border-transparent rounded-custom text-transparent"
              >
                Loading...
              </span>
            ))}
        </div>

        {/* Topics List */}
        <div className="w-full flex items-center flex-wrap gap-2">
          {displayedTopics.map((topic: Topic) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("topic", topic.name);
            newParams.set("page", "1");

            return (
              <Link
                key={topic.id}
                href={`?${newParams.toString()}`}
                aria-label={`View questions related to ${topic.name}`}
                className={`${
                  currentTopic === topic.name
                    ? "bg-primary text-white"
                    : "hover:bg-slate-200"
                } px-3 py-1 rounded-custom border  transition-colors`}
              >
                {topic.name}
              </Link>
            );
          })}
          {topics.length > 3 && (
            <button
              onClick={() => setMore(!more)}
              className="px-3 h-[35.4px] border rounded-custom hover:bg-slate-200 transition-colors"
            >
              <FaChevronDown
                className={`${
                  more ? "rotate-180" : "rotate-0"
                } transition-transform`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
