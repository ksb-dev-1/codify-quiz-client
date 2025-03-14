"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// hooks
import { useHandleOutsideClick } from "@/hooks/useHandleOutsideClick";

// lib
import fetchQuestionCount from "@/lib/fetchQuestionCount";
import uploadImage from "@/lib/uploadImage";

// components
import Statistics from "@/components/Statistics";

// 3rd party
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaCircleUser } from "react-icons/fa6";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import deleteAccount from "@/lib/deleteAccount";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const name = session?.user?.name;
  const email = session?.user?.email;
  const image = session?.user?.image;
  const [isUploadImageOpen, setIsUploadImageOpen] = useState<boolean>(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined | null>(
    image
  );

  const uploadImageDivRef = useRef<HTMLDivElement>(null);
  const deleteAccountRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  //const queryClient = useQueryClient();

  useHandleOutsideClick(uploadImageDivRef, setIsUploadImageOpen);
  useHandleOutsideClick(deleteAccountRef, setIsDeleteAccountOpen);

  // To handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isUploadImageOpen) {
        setIsUploadImageOpen(false);
        setIsDeleteAccountOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [isUploadImageOpen]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["question-count"],
    queryFn: fetchQuestionCount,
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      update();
      setPreviewImage(data.imageUrl);
      setIsUploadImageOpen(false);
      setPreviewImage(data.imageUrl); // Reset preview to original image
      setSelectedFile(null);

      // Reset file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // This clears the file input
      }
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      //signOut();
      //update();
      setIsDeleteAccountOpen(false);
      window.location.href = "/pages/signin";
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      mutate(selectedFile);
    }
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-xl text-red-600">
        Failed to fetch profile details!
      </p>
    );
  }

  if (!data) {
    return (
      <p className="text-center text-xl text-red-600">
        Profile details not found!
      </p>
    );
  }

  return (
    <>
      <div className="relative flex flex-col sm:flex-row sm:items-start">
        <div className="relative border bg-white rounded-custom p-8">
          {status === "loading" ? (
            <div className="skeleton relative h-[100px] w-[100px] rounded-custom border border-transparent" />
          ) : (
            <div className="relative h-[100px] w-[100px]">
              {image ? (
                <div className="relative h-[100px] w-[100px] rounded-custom overflow-hidden border">
                  <Image
                    src={image}
                    alt="image"
                    height={100}
                    width={100}
                    className="cursor-pointer rounded-custom object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
              ) : (
                <div className="relative h-[100px] w-[100px] rounded-custom border">
                  <FaCircleUser className="text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl" />
                </div>
              )}
              {/* Edit image button */}
              <button
                aria-label="Edit image edit button"
                onClick={() => setIsUploadImageOpen(true)}
                className="absolute w-8 h-8 rounded-tr-custom rounded-bl-custom bg-[rgba(0,0,0,0.5)] text-white hover:bg-black transition-colors top-0 right-0 shadow-md cursor-pointer"
              >
                <LiaEdit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
              </button>
            </div>
          )}
          <div className="mt-4">
            <p className="font-semibold text-xl">{name}</p>
            <p>{email}</p>
          </div>
          {/* Delete account button */}
          <button
            aria-label="Delete account button"
            onClick={() => setIsDeleteAccountOpen(true)}
            className="absolute w-8 h-8 rounded-tr-custom rounded-bl-custom bg-red-600 text-white hover:bg-red-700 transition-colors top-0 right-0 cursor-pointer"
          >
            <RiDeleteBin6Line className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl" />
          </button>
        </div>
        <Statistics data={data} />
      </div>
      {/* Edit image modal */}
      <div
        className={`${
          isUploadImageOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity fixed top-0 left-0 right-0 bottom-0 bg-[rgb(0,30,43,0.95)] px-4 flex items-center justify-center z-10`}
      >
        <div
          ref={uploadImageDivRef}
          className={`${
            isUploadImageOpen ? "translate-y-0" : "translate-y-[100%]"
          } transition-transform duration-300 max-w-xl w-full flex flex-col bg-white rounded-custom p-8`}
        >
          {previewImage && (
            <div className="relative h-[100px] w-[100px] rounded-custom overflow-hidden">
              <Image
                src={previewImage}
                alt="image"
                height={100}
                width={100}
                className="cursor-pointer rounded-custom object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="my-8"
          />
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleUpload}
              disabled={isPending}
              className="px-4 py-2 rounded-custom bg-primary text-white hover:bg-hover transition-colors"
            >
              {isPending ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={() => {
                setIsUploadImageOpen(false);
                setPreviewImage(image); // Reset preview to original image
                setSelectedFile(null);

                // Reset file input field
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""; // This clears the file input
                }
              }}
              className="px-4 py-2 rounded-custom bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500">Upload failed!</p>}
        </div>
      </div>

      {/* Delete account modal */}
      <div
        className={`${
          isDeleteAccountOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity fixed top-0 left-0 right-0 bottom-0 bg-[rgb(0,30,43,0.95)] px-4 flex items-center justify-center z-10`}
      >
        <div
          ref={deleteAccountRef}
          className={`${
            isDeleteAccountOpen ? "translate-y-0" : "translate-y-[100%]"
          } transition-transform duration-300 bg-white rounded-custom p-8`}
        >
          <p>Do you want to delete your account?</p>
          <div className="max-w-xl w-full my-8 border border-amber-700 bg-amber-100 text-amber-700 rounded-custom p-4">
            <p className="text-xl mb-2"> Note:</p>
            <p>
              This will delete everything related to your accout such as saved
              questions, your progress etc...
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
              className="px-4 py-2 rounded-custom bg-primary text-white hover:bg-hover transition-colors"
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => setIsDeleteAccountOpen(false)}
              className="px-4 py-2 rounded-custom bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
