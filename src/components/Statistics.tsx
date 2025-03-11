import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// "#2563eb"
const COLORS = ["#059669", "#d97706", "#001E2B", "#2196F3"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Statistics({ data }: any) {
  const totalQuestionsCount = data.totalQuestionsCount || 0;
  const solvedQuestionsCount = data.totalSolvedCount || 0;
  const attempteddQuestionsCount = data.totalAttemptedCount || 0;
  const totalEasyQuestionsCount = data.totalEasyCount || 0;
  const solvedEasyQuestionsCount = data.EASY.solved || 0;
  const attemptedEasyQuestionsCount = data.EASY.attempted || 0;
  const totalMediumQuestionsCount = data.totalMediumCount || 0;
  const solvedMediumQuestionsCount = data.MEDIUM.solved || 0;
  const attemptedMediumQuestionsCount = data.MEDIUM.attempted || 0;
  const totalHardQuestionsCount = data.totalHardCount || 0;
  const solvedHardQuestionsCount = data.HARD.solved || 0;
  const attemptedHardQuestionsCount = data.HARD.attempted || 0;

  const remainingQuestions = totalQuestionsCount - solvedQuestionsCount;
  const remainingEasyQuestions =
    totalEasyQuestionsCount -
    solvedEasyQuestionsCount -
    attemptedEasyQuestionsCount;
  const remainingMediumQuestions =
    totalMediumQuestionsCount -
    solvedMediumQuestionsCount -
    attemptedMediumQuestionsCount;
  const remainingHardQuestions =
    totalHardQuestionsCount -
    solvedHardQuestionsCount -
    attemptedHardQuestionsCount;

  const dataProgress = [
    { name: "Solved", value: solvedQuestionsCount },
    { name: "Attempted", value: attempteddQuestionsCount },
    { name: "Remaining", value: remainingQuestions },
  ];

  const easyProgress = [
    { name: "Solved", value: solvedEasyQuestionsCount },
    { name: "Attempted", value: attemptedEasyQuestionsCount },
    { name: "Remaining", value: remainingEasyQuestions },
  ];

  const mediumProgress = [
    { name: "Solved", value: solvedMediumQuestionsCount },
    { name: "Attempted", value: attemptedMediumQuestionsCount },
    { name: "Remaining", value: remainingMediumQuestions },
  ];

  const hardProgress = [
    { name: "Solved", value: solvedHardQuestionsCount },
    { name: "Attempted", value: attemptedHardQuestionsCount },
    { name: "Remaining", value: remainingHardQuestions },
  ];

  return (
    <div className="mt-8 sm:mt-0 sm:ml-8 bg-white border rounded-custom p-8 w-full">
      <p className="font-semibold text-xl mb-4">Statistics</p>
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-16">
        {[
          { title: "Overall", data: dataProgress },
          { title: "Easy", data: easyProgress },
          { title: "Medium", data: mediumProgress },
          { title: "Hard", data: hardProgress },
        ].map((chart, index) => (
          <div key={index} className="flex flex-col items-center">
            <p className="font-medium mb-2">{chart.title}</p>
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={chart.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={80}
                  label
                  paddingAngle={5}
                >
                  {chart.data.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                {/* <Tooltip /> */}
                <Tooltip
                  content={({ payload }) =>
                    payload && payload.length ? (
                      <div className="custom-tooltip">
                        <p>
                          {payload[0].name}: {payload[0].value}
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
