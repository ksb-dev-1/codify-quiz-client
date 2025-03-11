"use client";

// lib
import toggleSaveQuestion from "@/lib/toggleSaveQuestion";

// 3rd party
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";

export default function ToggleSaveQuestionButton({
  userId,
  questionId,
  marginTop,
  isSaved,
}: {
  userId: string;
  questionId: string;
  marginTop?: string;
  isSaved: boolean;
}) {
  const queryClient = useQueryClient();

  const toggleSaveQuestionMutation = useMutation({
    mutationFn: async () => {
      return toggleSaveQuestion(userId, questionId); // Get response instead of throwing
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        queryClient.invalidateQueries({ queryKey: ["question"] });
        queryClient.invalidateQueries({ queryKey: ["saved-questions"] });
        queryClient.invalidateQueries({ queryKey: ["question-count"] });
        toast.success(response.message);
      } else {
        toast.error(response.message); // Show error message to the user
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Something went wrong!");
    },
  });

  if (toggleSaveQuestionMutation.isPending) {
    return (
      <button
        className={`${marginTop} sm:mt-0 sm:w-[calc(32px+2rem)] flex justify-end`}
      >
        <Loader className="w-6 h-6 animate-spin text-pink-600" />
      </button>
    );
  }

  if (!isSaved) {
    return (
      <button
        aria-label="save-question-button"
        onClick={() => toggleSaveQuestionMutation.mutate()}
        disabled={toggleSaveQuestionMutation.isPending}
        className={`${marginTop} sm:mt-0 sm:w-[calc(32px+2rem)] flex justify-end`}
      >
        <VscHeart className="w-6 h-6 text-pink-600 cursor-pointer" />
      </button>
    );
  }

  return (
    <button
      aria-label="save-question-button"
      onClick={() => toggleSaveQuestionMutation.mutate()}
      disabled={toggleSaveQuestionMutation.isPending}
      className={`${marginTop} sm:mt-0 sm:w-[calc(32px+2rem)] flex justify-end`}
    >
      <VscHeartFilled className="w-6 h-6 text-pink-600 cursor-pointer" />
    </button>
  );
}
