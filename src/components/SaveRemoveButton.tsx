"use client";

import { useState } from "react";

// hooks
import { useSaveQuestion } from "@/hooks/questions/useSaveQuestion";
import { useRemoveQuestion } from "@/hooks/questions/useRemoveQuestion";

// 3rd party
import { Loader } from "lucide-react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";

export default function SaveRemoveButton({
  questionId,
  isSaved,
  onSave,
  onRemove,
}: {
  questionId: string;
  isSaved: boolean;
  onSave: (questionId: string) => void;
  onRemove: (questionId: string) => void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const saveQuestionMutation = useSaveQuestion(setLoadingId);
  const removeQuestionMutation = useRemoveQuestion(setLoadingId);

  const handleSave = () => {
    onSave(questionId); // Optimistically update the UI
    saveQuestionMutation.mutate(questionId, {
      onError: () => onRemove(questionId), // Rollback on error
    });
  };

  const handleRemove = () => {
    onRemove(questionId); // Optimistically update the UI
    removeQuestionMutation.mutate(questionId, {
      onError: () => onSave(questionId), // Rollback on error
    });
  };

  // Loading state
  if (loadingId === questionId) {
    return (
      <button className="mt-6 sm:mt-0 sm:w-[calc(32px+2rem)] text-pink-600 flex justify-end">
        <Loader className="w-5 h-5 animate-spin" />
      </button>
    );
  }

  return (
    <>
      {/* Save Button */}
      {!isSaved && (
        <button
          aria-label="save-question-button"
          onClick={handleSave}
          disabled={loadingId === questionId}
          className="mt-6 sm:mt-0 sm:w-[calc(32px+2rem)] flex justify-end"
        >
          <VscHeart className="w-5 h-5 text-pink-600 cursor-pointer" />
        </button>
      )}

      {/* Remove Button */}
      {isSaved && (
        <button
          aria-label="remove-question-button"
          onClick={handleRemove}
          disabled={loadingId === questionId}
          className="mt-6 sm:mt-0 sm:w-[calc(32px+2rem)] flex justify-end"
        >
          <VscHeartFilled className="w-5 h-5 text-pink-600 cursor-pointer" />
        </button>
      )}
    </>
  );
}
