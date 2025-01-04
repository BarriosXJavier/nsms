"use client";
import { Calendar } from "react-calendar";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  id: number;
  title: string;
  time: string;
  description: string;
  location: string;
  date: Date;
}

const events: Event[] = [
  {
    id: 1,
    title: "Event 1",
    time: "10:00 AM - 12:00 PM",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    location: "Room A",
    date: new Date(2023, 9, 15),
  },
  {
    id: 2,
    title: "Event 2",
    time: "2:00 PM - 4:00 PM",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    location: "Room B",
    date: new Date(2023, 9, 15),
  },
  {
    id: 3,
    title: "Event 3",
    time: "5:00 PM - 7:00 PM",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    location: "Room C",
    date: new Date(2023, 9, 20),
  },
  {
    id: 4,
    title: "Event 4",
    time: "8:00 AM - 10:00 AM",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    location: "Room D",
    date: new Date(2025, 1, 13),
  }
];

const EventItem = ({ event }: { event: Event }) => (
  <div className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h2 className="text-lg font-semibold">{event.title}</h2>
      <span className="text-sm text-gray-600">{event.time}</span>
    </div>
    <p className="text-sm text-gray-500 mt-2">{event.description}</p>
    <span className="text-sm text-gray-600 block mt-2">{event.location}</span>
  </div>
);

const EventList = ({ events }: { events: Event[] }) => (
  <div className="mt-4 space-y-4">
    {events.map((event) => (
      <EventItem key={event.id} event={event} />
    ))}
  </div>
);

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  const filteredEvents = events.filter(
    (event) => event.date.toDateString() === (value as Date).toDateString()
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold mb-4">Event Calendar</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-6">
        <div className="w-full max-w-full overflow-x-auto">
          <Calendar
            onChange={onChange}
            value={value}
            className="border rounded-lg p-2 w-full max-w-full"
          />
        </div>
        <div className="w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Events on {value?.toDateString()}
          </h2>
          {filteredEvents.length > 0 ? (
            <EventList events={filteredEvents} />
          ) : (
            <p className="text-gray-500">No events for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
