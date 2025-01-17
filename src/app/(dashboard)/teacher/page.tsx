import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import BigCalendar from "@/components/BigCalendar";

const TeacherPage = () => {
  return (
    <div className="p-4 flex flex-1 gap-4 flex-col xl:flex-row">
      {/*Left*/}
      <div className="w-full xl:w-2/3 ">
        <div className="h-full rounded-md bg-white">
          <h1 className="text-lg font-semibold">Schedule </h1>
          <BigCalendar />
        </div>
      </div>
      {/*Right*/}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage
