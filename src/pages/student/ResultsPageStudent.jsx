import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ResultsPageStudent() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/results/me").then((res) => setResults(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-lg p-8 text-white mb-8">

        <h1 className="text-3xl font-bold">
          📊 My Results
        </h1>

        <p className="mt-2 text-blue-100">
          View all your examination results.
        </p>

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-blue-700 text-white">

              <tr>

                <th className="py-4 px-5 text-left">
                  Exam
                </th>

                <th className="py-4 px-5 text-left">
                  Marks
                </th>

                <th className="py-4 px-5 text-left">
                  Percentage
                </th>

                <th className="py-4 px-5 text-left">
                  Status
                </th>

                <th className="py-4 px-5 text-left">
                  Submitted
                </th>

              </tr>

            </thead>

            <tbody>

              {results.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-500"
                  >
                    No Results Found
                  </td>

                </tr>

              ) : (

                results.map((result) => (

                  <tr
                    key={result._id}
                    className="border-b hover:bg-blue-50 transition"
                  >

                    <td className="py-5 px-5 font-semibold">

                      {result.exam?.examName}

                    </td>

                    <td className="py-5 px-5">

                      <span className="font-bold text-blue-700">
                        {result.marks}
                      </span>

                    </td>

                    <td className="py-5 px-5">

                      <div className="w-40">

                        <div className="bg-gray-200 rounded-full h-3">

                          <div
                            className="bg-blue-600 h-3 rounded-full"
                            style={{
                              width: `${result.percentage || 0}%`,
                            }}
                          ></div>

                        </div>

                        <p className="text-sm mt-2">

                          {result.percentage || 0}%

                        </p>

                      </div>

                    </td>

                    <td className="py-5 px-5">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold

                        ${
                          result.status === "passed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                        `}
                      >

                        {result.status}

                      </span>

                    </td>

                    <td className="py-5 px-5 text-gray-500">

                      {new Date(result.submittedAt).toLocaleString()}

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