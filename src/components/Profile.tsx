"use client";

import Image from "next/image";

// components
import Statistics from "@/components/Statistics";

// 3rd party
import { useQuery } from "@tanstack/react-query";
import { FaCircleUser } from "react-icons/fa6";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import fetchQuestionCount from "@/lib/fetchQuestionCount";

type ProfileProps = {
  userId: string;
  name: string | undefined;
  email: string | undefined;
  image: string | undefined;
};

export default function Profile({ userId, name, email, image }: ProfileProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["question-count", userId],
    queryFn: () => fetchQuestionCount(userId),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to fetch question count!</p>;
  }

  if (!data) {
    return <p>Data not found!</p>;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start">
      <div className="relative border rounded-custom p-8">
        <div className="relative h-[100px] w-[100px]">
          {image ? (
            <Image
              src={image}
              alt="image"
              height={100}
              width={100}
              priority
              className="rounded-custom object-cover"
            />
          ) : (
            <div className="relative h-[100px] w-[100px] rounded-custom border">
              <FaCircleUser className="text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl" />
            </div>
          )}
          <div className="absolute w-8 h-8 rounded-tr-custom rounded-bl-custom bg-[rgba(0,0,0,0.5)] text-white hover:bg-black transition-colors top-0 right-0 shadow-md cursor-pointer">
            <LiaEdit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold text-xl">{name}</p>
          <p>{email}</p>
        </div>
        <div className="absolute w-8 h-8 rounded-tr-custom rounded-bl-custom bg-red-600 text-white hover:bg-red-700 transition-colors top-0 right-0 cursor-pointer">
          <RiDeleteBin6Line className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
        </div>
      </div>
      <Statistics data={data} />
    </div>
  );
}
