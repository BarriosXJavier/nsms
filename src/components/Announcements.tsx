import React from 'react'


const Announcements = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-xl text-gray-800">Announcements</h1>
        <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
          View All
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {[
          {
            title: "System Maintenance Notice",
            description: "Scheduled maintenance will be performed on our servers this weekend. Expected downtime is 2 hours."
          },
          {
            title: "New Feature Release",
            description: "We're excited to announce our latest feature update including improved user interface and faster performance."
          },
          {
            title: "Holiday Schedule Update",
            description: "Please note our modified working hours during the upcoming holiday season. Check the detailed schedule below."
          },
          {
            title: "Team Meeting Announcement",
            description: "Monthly all-hands meeting will be held next Tuesday at 10 AM in the main conference room."
          },
          {
            title: "Policy Changes",
            description: "Important updates to our company policies will take effect from next month. Please review the changes."
          },
          {
            title: "Office Renovation Notice",
            description: "The third floor will undergo renovation starting next week. Temporary workspaces have been arranged."
          }
        ].map((announcement, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-red-50'
              } transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium text-gray-800">{announcement.title}</h2>
              <span className="text-xs text-gray-600 bg-white rounded-full px-3 py-1 shadow-sm">
                {new Date().getFullYear()}.
                {String(new Date().getMonth() + 1).padStart(2, '0')}.
                {String(new Date().getDate()).padStart(2, '0')}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Announcements  
