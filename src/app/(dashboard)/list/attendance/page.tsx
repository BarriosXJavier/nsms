const AttendancePage = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Attendance</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Attendance Tracking</h2>
          <p className="text-gray-600 mb-4">
            The attendance tracking feature is coming soon. This will allow teachers to mark student attendance
            and view attendance reports.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-gray-700">
            <p className="font-medium mb-2">Planned Features:</p>
            <ul className="text-left space-y-1">
              <li>• Daily attendance marking</li>
              <li>• Attendance reports and statistics</li>
              <li>• Export attendance data</li>
              <li>• Automated notifications for absences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendancePage
