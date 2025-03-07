export default function QuestionsHeader({ text }: { text: string }) {
  return (
    <>
      <h1 className="font-semibold text-xl">{text}</h1>
      <div className="mt-4 flex items-center justify-between sm:justify-normal px-4 sm:px-6 py-2 rounded-custom border-primary bg-primary text-white">
        <div className="sm:w-[calc(100%-97.28px+4rem+87.38px+2rem)] flex flex-col-reverse sm:flex-row sm:items-center justify-between sm:justify-normal">
          <span className="mt-6 sm:mt-0 sm:w-[calc(97.27px+3rem)] flex items-center">
            Status
          </span>
          <span className="sm:w-[calc(100%-97.27px+3rem)] flex items-center">
            Topic
          </span>
        </div>
        <div className="sm:w-[calc(55.38px+32px+2rem)] flex flex-col sm:flex-row sm:items-center justify-between sm:justify-normal">
          <span className="sm:w-[calc(55.38px)] flex items-center justify-end">
            Difficulty
          </span>
          <div className="mt-6 sm:mt-0 sm:w-[calc(32px+2rem)] flex justify-end">
            Save
          </div>
        </div>
      </div>
    </>
  );
}
