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
}

export default function Filter({
  currentStatus,
  currentDifficulty,
  topicsData,
  topicsLoading,
  topicsError,
  currentTopic,
}: FilterProps) {
  return (
    <>
      <StatusFilter currentStatus={currentStatus} />
      <DifficultyFilter currentDifficulty={currentDifficulty} />
      <TopicsFilter
        topicsLoading={topicsLoading}
        topicsError={topicsError}
        topicsData={topicsData}
        currentTopic={currentTopic}
      />
    </>
  );
}
