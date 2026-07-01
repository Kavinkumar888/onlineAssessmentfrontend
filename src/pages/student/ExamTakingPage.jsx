return (
  <div className="min-h-screen bg-slate-100">

    {/* Header */}

    <div className="bg-blue-700 text-white px-8 py-4 shadow-lg flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold">{exam.examName}</h2>
        <p className="text-blue-100">
          Online Examination
        </p>
      </div>

      <div className="text-right">

        <div className="text-lg font-semibold">
          ⏰ {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

        <div className="text-sm">
          Progress {progress}%
        </div>

      </div>

    </div>



    <div className="grid lg:grid-cols-4 gap-6 p-6">

      {/* Question Palette */}

      <div className="bg-white rounded-xl shadow-md p-5">

        <h3 className="font-bold text-lg mb-4">
          Questions
        </h3>

        <div className="grid grid-cols-5 gap-3">

          {questions.map((q, i) => (

            <button
              key={q._id}
              onClick={() => setCurrentIndex(i)}
              className={`h-11 rounded-lg font-semibold transition

              ${
                answers[q._id]
                  ? "bg-green-500 text-white"
                  : currentIndex === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }
              `}
            >
              {i + 1}
            </button>

          ))}

        </div>

        <hr className="my-6"/>

        <button
          onClick={submitExam}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
        >
          Submit Exam
        </button>

      </div>



      {/* Question */}

      <div className="lg:col-span-3">

        <div className="bg-white rounded-xl shadow-md p-8">

          <div className="mb-5">

            <div className="flex justify-between">

              <span className="font-semibold text-blue-600">
                Question {currentIndex + 1}
              </span>

              <span className="text-gray-500">
                {questions.length} Questions
              </span>

            </div>

          </div>



          {/* Progress */}

          <div className="w-full h-3 bg-gray-200 rounded-full mb-8">

            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>



          <h3 className="text-2xl font-semibold mb-8">

            {question?.question}

          </h3>



          <div className="space-y-4">

            {question?.options?.map((option, index) => (

              <label
                key={index}
                className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition

                ${
                  answers[question._id] === option
                    ? "border-blue-600 bg-blue-50"
                    : "hover:bg-gray-100"
                }

                `}
              >

                <input
                  type="radio"
                  name={question._id}
                  checked={answers[question._id] === option}
                  onChange={() =>
                    setAnswers({
                      ...answers,
                      [question._id]: option,
                    })
                  }
                />

                <span className="text-lg">
                  {option}
                </span>

              </label>

            ))}

          </div>



          <div className="flex justify-between mt-10">

            <button
              disabled={currentIndex === 0}
              onClick={() =>
                setCurrentIndex(currentIndex - 1)
              }
              className="bg-gray-300 hover:bg-gray-400 px-8 py-3 rounded-lg"
            >
              Previous
            </button>

            <button
              onClick={() =>
                setCurrentIndex(
                  Math.min(
                    questions.length - 1,
                    currentIndex + 1
                  )
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>
);
if (!instructionsAccepted) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-10">

        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          📋 Exam Instructions
        </h2>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded">

          <p className="text-gray-700 leading-8">
            {exam.instructions ||
              "Please read all instructions carefully before starting the examination."}
          </p>

        </div>

        <label className="flex items-center gap-3 mt-8">

          <input
            type="checkbox"
            checked={instructionsAccepted}
            onChange={() =>
              setInstructionsAccepted(true)
            }
            className="w-5 h-5"
          />

          <span>
            I have read and understood all instructions.
          </span>

        </label>

        <button
          onClick={() =>
            setInstructionsAccepted(true)
          }
          disabled={!instructionsAccepted}
          className="mt-8 w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Start Exam
        </button>

      </div>

    </div>
  );
}