import Image from "next/image";

const UserCard = ({ type }: { type: string }) => {
  return (
    <div className="rounded-2xl odd:bg-purple-200 even:bg-yellow-300 p-4 min-w-[130px]">
      <div>
        <span>
          {new Date().getFullYear()}/{new Date().getMonth()}/
          {new Date().getDay()}
        </span>

        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">1234</h1>
      <h2>{type}</h2>
    </div>
  );
};

export default UserCard;
