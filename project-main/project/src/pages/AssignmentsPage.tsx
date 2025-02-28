import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  StopCircle,
  FileText,
} from "lucide-react";
import { Assignment, Hotel } from "../types";
import { format, differenceInMinutes } from "date-fns";
import {
  assignmentService,
  hotelService,
  housekeeperService,
} from "../services/api";

export function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedHousekeeperId, setSelectedHousekeeperId] = useState<
    string | null
  >(null);
  const [activeAssignments, setActiveAssignments] = useState<
    Record<string, boolean>
  >({});
  const [reports, setReports] = useState<
    Record<string, { totalTime: number; averageTime: number }>
  >({});

  const fetchAssignments = async (housekeeperId: string) => {
    const fetchedAssignments = await assignmentService.getAllAssignments();
    setAssignments(fetchedAssignments);
  };

  useEffect(() => {
    if (selectedHousekeeperId) {
      fetchAssignments(selectedHousekeeperId);
    }
  }, [selectedHousekeeperId]);

  console.log("first ass", assignments);

  const handleStartCleaning = (assignment_id: string) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) => {
        if (assignment._id === assignment_id) {
          return {
            ...assignment,
            status: "In Progress",
            startTime: new Date().toISOString(),
          };
        }
        return assignment;
      })
    );
    setActiveAssignments((prev) => ({ ...prev, [assignment_id]: true }));
  };

  const handleFinishCleaning = (assignment_id: string) => {
    const assignment = assignments.find((a) => a._id === assignment_id);
    if (!assignment || !assignment.startTime) return;

    const endTime = new Date().toISOString();
    const totalMinutes = differenceInMinutes(
      new Date(endTime),
      new Date(assignment.startTime)
    );

    setAssignments((prevAssignments) =>
      prevAssignments.map((a) => {
        if (a._id === assignment_id) {
          return {
            ...a,
            status: "Clean",
            endTime,
            totalMinutes,
          };
        }
        return a;
      })
    );

    // Update reports using the functional form
    setReports((prevReports) => {
      const housekeeperReports = prevReports[assignment.housekeeperId] || {
        totalTime: 0,
        averageTime: 0,
      };
      const newTotalTime = housekeeperReports.totalTime + totalMinutes;
      const completedAssignments =
        assignments.filter(
          (a) =>
            a.housekeeperId === assignment.housekeeperId && a.totalMinutes > 0
        ).length + 1;

      return {
        ...prevReports,
        [assignment.housekeeperId]: {
          totalTime: newTotalTime,
          averageTime: newTotalTime / completedAssignments,
        },
      };
    });

    setActiveAssignments((prev) => ({ ...prev, [assignment_id]: false }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Assigned Rooms</h1>
        <button
          onClick={() => {
            /* Add functionality to generate detailed report */
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="h-5 w-5 mr-2" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
              assignment.status === "Clean"
                ? "border-green-500"
                : assignment.status === "In Progress"
                ? "border-yellow-500"
                : "border-red-500"
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">
                  Room {assignment.roomId}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === "Clean"
                      ? "bg-green-100 text-green-800"
                      : assignment.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {assignment.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {assignment.startTime
                      ? `Started: ${format(
                          new Date(assignment.startTime),
                          "HH:mm:ss"
                        )}`
                      : "Not started"}
                  </span>
                </div>
                {assignment.endTime && (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>
                      Finished:{" "}
                      {format(new Date(assignment.endTime), "HH:mm:ss")}
                    </span>
                  </div>
                )}
                {assignment.totalMinutes > 0 && (
                  <div className="flex items-center font-medium">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Total time: {assignment.totalMinutes} minutes</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                {assignment.status !== "Clean" &&
                  !activeAssignments[assignment._id] && (
                    <button
                      onClick={() => handleStartCleaning(assignment._id)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Cleaning
                    </button>
                  )}
                {activeAssignments[assignment._id] && (
                  <button
                    onClick={() => handleFinishCleaning(assignment._id)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Finish Cleaning
                  </button>
                )}
                {assignment.status === "Clean" && (
                  <button
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md cursor-not-allowed"
                    disabled
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Reports Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Performance Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(reports).map(([housekeeper_id, report]) => (
            <div
              key={housekeeper_id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <h3 className="font-semibold mb-2">Housekeeper Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time:</span>
                  <span className="font-medium">
                    {report.totalTime} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Time per Room:</span>
                  <span className="font-medium">
                    {Math.round(report.averageTime)} minutes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <XCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No Assignments</h3>
          <p className="text-gray-600">There are no room assignments yet.</p>
        </div>
      )}
    </div>
  );
}
