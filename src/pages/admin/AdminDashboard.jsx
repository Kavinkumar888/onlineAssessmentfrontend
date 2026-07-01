import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    exams: 0,
    completed: 0,
    average: 0,
    highest: 0,
    lowest: 0,
    passRate: 0,
  });

  const [exams, setExams] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/results/analytics"),
      api.get("/exams"),
    ]).then(([analyticsRes, examsRes]) => {
      setStats(analyticsRes.data);
      setExams(examsRes.data);
    });
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: stats.students,
      icon: "👨‍🎓",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Exams",
      value: stats.exams,
      icon: "📝",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Completed Exams",
      value: stats.completed,
      icon: "✅",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Average Marks",
      value: stats.average,
      icon: "📊",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          📊 Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome to the Online Examination Management System
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 border border-gray-100"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold text-slate-800 mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-3xl text-white shadow-lg`}
              >
                {card.icon}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Latest Exams */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-xl font-bold text-slate-800 mb-5">
            📝 Latest Exams
          </h2>

          {exams.length === 0 ? (
            <p className="text-gray-500">
              No exams available
            </p>
          ) : (
            <div className="space-y-4">
              {exams.slice(0, 5).map((exam) => (
                <div
                  key={exam._id}
                  className="flex justify-between items-center p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {exam.examName}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Examination
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      exam.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-xl font-bold text-slate-800 mb-5">
            📈 Analytics
          </h2>

          <div className="space-y-5">

            <div>
              <div className="flex justify-between mb-2">
                <span>Highest Score</span>
                <span className="font-bold">{stats.highest}</span>
              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: `${stats.highest}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Lowest Score</span>
                <span className="font-bold">{stats.lowest}</span>
              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-red-500"
                  style={{ width: `${stats.lowest}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Pass Rate</span>
                <span className="font-bold">
                  {stats.passRate}%
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{ width: `${stats.passRate}%` }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}