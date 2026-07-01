import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    students: 0,
    exams: 0,
    completed: 0,
    average: 0,
    highest: 0,
    lowest: 0,
    passRate: 0,
  });

  useEffect(() => {
    api.get("/results/analytics").then((res) => setStats(res.data));
  }, []);

  const analytics = [
    {
      title: "Highest Score",
      value: stats.highest,
      icon: "🏆",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Lowest Score",
      value: stats.lowest,
      icon: "📉",
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Average Score",
      value: stats.average,
      icon: "📊",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Pass Percentage",
      value: `${stats.passRate}%`,
      icon: "🎯",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          📈 Analytics Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          View student performance and examination statistics.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {analytics.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  {item.title}
                </p>

                <h2 className="text-4xl font-bold text-slate-800 mt-3">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl text-white shadow-lg`}
              >
                {item.icon}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          📊 Performance Overview
        </h2>

        <div className="space-y-6">

          {/* Highest */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Highest Score</span>
              <span className="font-bold">{stats.highest}</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 rounded-full bg-green-500"
                style={{ width: `${stats.highest}%` }}
              ></div>
            </div>
          </div>

          {/* Average */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Average Score</span>
              <span className="font-bold">{stats.average}</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 rounded-full bg-blue-500"
                style={{ width: `${stats.average}%` }}
              ></div>
            </div>
          </div>

          {/* Pass Rate */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Pass Percentage</span>
              <span className="font-bold">{stats.passRate}%</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 rounded-full bg-purple-500"
                style={{ width: `${stats.passRate}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}