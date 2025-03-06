// import Link from "next/link";

// // constants
// import { getStatusIcon } from "@/constants/statuses";

// // types
// import { Question } from "@/types/types";

// // components
// import QuestionsHeader from "./shared/QuestionsHeader";
// import removeQuestionAction from "@/actions/removeQuestionAction";
// import saveQuestionAction from "@/actions/saveQuestionAction";
// import RemoveQuestionButton from "./RemoveQuestionButton";
// import SaveQuestionButton from "./SaveQuestionButton";

// interface QuestionListProps {
//   questions: Question[];
//   isFilterApplied: string | undefined;
// }

// export default async function QuestionList({
//   questions,
//   isFilterApplied,
// }: QuestionListProps) {
//   if (questions.length === 0 && !isFilterApplied) {
//     return <p className="text-xl mt-8">No questions found!</p>;
//   }

//   if (questions.length === 0 && isFilterApplied) {
//     return (
//       <p className="text-xl mt-8">
//         No questions found! Try using differnt filters.
//       </p>
//     );
//   }

//   return (
//     <div className="mt-8">
//       <QuestionsHeader text="Questions" />
//       <div className="border-x">
//         {questions.map(
//           ({ id, status, topicName, difficulty, isSaved }, index) => {
//             const StatusIcon = getStatusIcon(status);

//             // Define colors statically
//             let statusIconColor = "";

//             if (status === "TODO") {
//               statusIconColor = "text-blue-600";
//             } else if (status === "SOLVED") {
//               statusIconColor = "text-emerald-700";
//             } else if (status === "ATTEMPTED") {
//               statusIconColor = "text-orange-600";
//             }

//             // Define colors statically
//             let difficultyTextColor = "";

//             if (difficulty === "EASY") {
//               difficultyTextColor = "text-teal-700";
//             } else if (difficulty === "MEDIUM") {
//               difficultyTextColor = "text-yellow-700";
//             } else if (difficulty === "HARD") {
//               difficultyTextColor = "text-red-600";
//             }

//             return (
//               <div
//                 key={id}
//                 className="w-full border-b p-4 sm:p-6 flex flex-row justify-between sm:justify-normal"
//               >
//                 <div className="w-full sm:w-[calc(100%-97.27px+3rem+87.38px+2rem)] flex sm:items-center flex-col-reverse sm:flex-row justify-between sm:justify-normal">
//                   {/* Status */}
//                   <span className="sm:w-[calc(97.27px+3rem)] flex items-center">
//                     {StatusIcon && (
//                       <StatusIcon
//                         className={`text-xl mr-2 ${statusIconColor}`}
//                       />
//                     )}
//                     <span>
//                       {status.charAt(0) +
//                         status.substring(1).toLocaleLowerCase()}
//                     </span>
//                   </span>

//                   {/* Topic */}
//                   <div className="sm:w-[calc(100%-97.28px+4rem)]">
//                     <div className="w-fit flex items-cente">
//                       <span className="mr-1 font-medium">{index + 1}.</span>
//                       <Link
//                         href={`/pages/questions/${id}`}
//                         className=" text-blue-600 underline"
//                       >
//                         {topicName}
//                       </Link>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="sm:w-[calc(55.38px+32px+2rem)] sm:mt-0 flex flex-col sm:flex-row items-end sm:items-center justify-between sm:justify-normal">
//                   {/* Difficulty */}
//                   <span
//                     className={`sm:w-[calc(55.38px)] flex justify-end ${difficultyTextColor}`}
//                   >
//                     {difficulty.charAt(0) +
//                       difficulty.substring(1).toLocaleLowerCase()}
//                   </span>

//                   {isSaved ? (
//                     <form action={removeQuestionAction}>
//                       <input type="hidden" name="questionID" value={id} />
//                       <RemoveQuestionButton />
//                     </form>
//                   ) : (
//                     <form action={saveQuestionAction}>
//                       <input type="hidden" name="questionID" value={id} />
//                       <SaveQuestionButton />
//                     </form>
//                   )}
//                 </div>
//               </div>
//             );
//           }
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";

// constants
import { getStatusIcon } from "@/constants/statuses";

// types
import { Question } from "@/types/types";

// actions
import saveQuestionAction from "@/actions/saveQuestionAction";
import removeQuestionAction from "@/actions/removeQuestionAction";

// components
import QuestionListSkeleton from "@/components/skeletons/QuestionListSkeleton";
import QuestionsHeader from "@/components/shared/QuestionsHeader";
import SaveQuestionButton from "./SaveQuestionButton";
import RemoveQuestionButton from "./RemoveQuestionButton";

interface QuestionListProps {
  questionsLoading: boolean;
  questionsError: boolean;
  questions: Question[];
  isFilterApplied: boolean;
}

export default function QuestionList({
  questionsLoading,
  questionsError,
  questions,
  isFilterApplied,
}: QuestionListProps) {
  if (questionsLoading) {
    return <QuestionListSkeleton text="Questions" marginTop="mt-8" />;
  }

  if (questionsError) {
    return (
      <p className="mt-8 text-center text-red-600 text-xl">
        Failed to fetch questions! Refresh the page or check your internet
        connection.
      </p>
    );
  }

  if (questions.length === 0 && !isFilterApplied) {
    return <p className="text-xl mt-8">No questions found!</p>;
  }

  if (questions.length === 0 && isFilterApplied) {
    return (
      <p className="text-xl mt-8">
        No questions found! Try using differnt filters.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <QuestionsHeader text="Questions" />
      <div className="border-x">
        {questions.map(
          ({ id, qNo, status, topicName, difficulty, isSaved }) => {
            const StatusIcon = getStatusIcon(status);

            // Define colors statically
            let statusIconColor = "";

            if (status === "TODO") {
              statusIconColor = "text-blue-600";
            } else if (status === "SOLVED") {
              statusIconColor = "text-emerald-700";
            } else if (status === "ATTEMPTED") {
              statusIconColor = "text-orange-600";
            }

            // Define colors statically
            let difficultyTextColor = "";

            if (difficulty === "EASY") {
              difficultyTextColor = "text-teal-700";
            } else if (difficulty === "MEDIUM") {
              difficultyTextColor = "text-yellow-700";
            } else if (difficulty === "HARD") {
              difficultyTextColor = "text-red-600";
            }

            return (
              <div
                key={id}
                className="w-full border-b p-4 sm:p-6 flex flex-row justify-between sm:justify-normal"
              >
                <div className="w-full sm:w-[calc(100%-97.27px+3rem+87.38px+2rem)] flex sm:items-center flex-col-reverse sm:flex-row justify-between sm:justify-normal">
                  {/* Status */}
                  <span className="sm:w-[calc(97.27px+3rem)] flex items-center">
                    {StatusIcon && (
                      <StatusIcon
                        className={`text-xl mr-2 ${statusIconColor}`}
                      />
                    )}
                    <span>
                      {status.charAt(0) + status.substring(1).toLowerCase()}
                    </span>
                  </span>

                  {/* Topic */}
                  <div className="sm:w-[calc(100%-97.28px+4rem)]">
                    <div className="w-fit flex items-cente">
                      <span className="mr-1 font-medium">{qNo}.</span>
                      <Link
                        href={`/pages/questions/${id}`}
                        className=" text-blue-600 underline"
                      >
                        {topicName}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="sm:w-[calc(55.38px+32px+2rem)] sm:mt-0 flex flex-col sm:flex-row items-end sm:items-center justify-between sm:justify-normal">
                  {/* Difficulty */}
                  <span
                    className={`sm:w-[calc(55.38px)] flex justify-end ${difficultyTextColor}`}
                  >
                    {difficulty.charAt(0) +
                      difficulty.substring(1).toLowerCase()}
                  </span>

                  {isSaved ? (
                    <form action={removeQuestionAction}>
                      <input type="hidden" name="questionID" value={id} />
                      <RemoveQuestionButton />
                    </form>
                  ) : (
                    <form action={saveQuestionAction}>
                      <input type="hidden" name="questionID" value={id} />
                      <SaveQuestionButton />
                    </form>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
