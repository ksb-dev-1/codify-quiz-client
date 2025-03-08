export default function QuestionDetailSkeleton() {
  return (
    <div className="text-transparent">
      <div className="flex items-center justify-between">
        {/* Back to questions link  */}
        <div className="skeleton rounded-custom">Back to Questions</div>

        {/* Save Button */}
        <button className="skeleton w-5 h-5 rounded-full"></button>
      </div>
      <div className="mt-4 border p-4 sm:p-8 rounded-custom">
        {/* Question */}
        <p className="skeleton rounded-custom">question</p>

        {/* Code Snippet */}
        <div className="mt-4 rounded-custom border overflow-hidden">
          <div className="skeleton rounded-custom h-[250px] w-full"></div>
        </div>

        {/* Multiple Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[1, 2, 3, 4].map((_, index) => {
            return (
              <button
                key={index}
                className="skeleton rounded-custom border border-transparent px-4 py-2"
              >
                <span className="font-bold">{index} : </span>
                <span>option</span>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        <button className="skeleton rounded-custom w-full mt-4 px-4 py-2 border border-transparent">
          Submit
        </button>
      </div>
    </div>
  );
}
