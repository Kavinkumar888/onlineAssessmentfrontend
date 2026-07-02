import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/results").then((res) => setResults(res.data));
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          📊 Exam Results
        </h1>
        <p className="text-gray-500 mt-2">
          View all student examination results.
        </p>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-blue-700">
            Results List
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">

              <tr>
                <th className="px-6 py-4 text-left">👨‍🎓 Student</th>
                <th className="px-6 py-4 text-left">📝 Exam</th>
                <th className="px-6 py-4 text-center">📊 Marks</th>
                <th className="px-6 py-4 text-center">✅ Status</th>
                <th className="px-6 py-4 text-center">⏱ Time</th>
              </tr>

            </thead>

            <tbody>

              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-500"
                  >
                    No results available.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr
                    key={result._id}
                    className="border-b hover:bg-blue-50 transition"
                  >

                    <td className="px-6 py-4 font-medium text-slate-700">
                      {result.student?.name}
                    </td>

                    <td className="px-6 py-4 text-black">
                      {result.exam?.examName}
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-blue-700">
                      {result.marks}
                    </td>

                    <td className="px-6 py-4 text-center text-black">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          result.status === "Passed" ||
                          result.status === "pass"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-center text-black">
                      {result.timeTaken}s
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}