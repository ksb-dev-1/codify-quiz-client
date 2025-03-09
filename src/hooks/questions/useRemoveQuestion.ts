import { Dispatch, SetStateAction } from "react";

// actions
import removeQuestionAction from "@/actions/removeQuestionAction";

// 3rd party
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRemoveQuestion = (
  setLoadingId: Dispatch<SetStateAction<string | null>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const formData = new FormData();
      formData.append("questionId", questionId);

      const response = await removeQuestionAction(formData);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to remove question");
      }

      return response;
    },
    onMutate: (id) => {
      setLoadingId(id); // Show loading state for the specific button
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["saved-questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", id] });
      queryClient.invalidateQueries({ queryKey: ["saved-status", id] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    },
    onSettled: () => {
      setLoadingId(null); // Hide loading state
    },
  });
};
