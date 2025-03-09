"use client";

// actions
import removeQuestionAction from "@/actions/removeQuestionAction";

// 3rd party
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { VscHeartFilled } from "react-icons/vsc";

export default function RemoveQuestionButton({
  questionId,
  marginTop,
}: {
  questionId: string;
  marginTop?: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("questionId", questionId);
      return removeQuestionAction(formData);
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
      toast.error("Something went wrong while removing the question.");
    },
  });

  return (
    <button
      aria-label="remove-question-button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`${marginTop} sm:mt-0 sm:w-[calc(32px+2rem)] flex justify-end`}
    >
      {mutation.isPending ? (
        <Loader className="w-6 h-6 animate-spin text-pink-600" />
      ) : (
        <VscHeartFilled className="w-6 h-6 text-pink-600 cursor-pointer" />
      )}
    </button>
  );
}
