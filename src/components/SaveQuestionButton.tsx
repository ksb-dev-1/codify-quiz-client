"use client";

// actions
import saveQuestionAction from "@/actions/saveQuestionAction";

// 3rd party
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { VscHeart } from "react-icons/vsc";

export default function SaveQuestionButton({
  questionId,
}: {
  questionId: string;
}) {
  const queryClient = useQueryClient();

  const saveQuestionMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("questionId", questionId);
      return saveQuestionAction(formData); // Get response instead of throwing
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        queryClient.invalidateQueries({ queryKey: ["question"] });
        queryClient.invalidateQueries({ queryKey: ["saved-questions"] });
      } else {
        toast.error(response.message); // Show error message to the user
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Something went wrong while saving the question.");
    },
  });

  return (
    <button
      aria-label="save-question-button"
      onClick={() => saveQuestionMutation.mutate()}
      disabled={saveQuestionMutation.isPending}
      className="mt-6 sm:mt-0 sm:w-[calc(32px+2rem)] flex justify-end"
    >
      {saveQuestionMutation.isPending ? (
        <Loader className="w-5 h-5 animate-spin text-pink-600" />
      ) : (
        <VscHeart className="text-2xl text-pink-600 cursor-pointer" />
      )}
    </button>
  );
}
