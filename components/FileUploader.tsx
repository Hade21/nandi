"use client";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useChangeProfilePictMutation } from "@/services/userApi";
import { motion } from "framer-motion";
import { CircleCheck, CircleX } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { toast } from "./ui/use-toast";

interface FileUploaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const FileUploader = ({ open, onOpenChange }: FileUploaderProps) => {
  const [upload, { isLoading, data, error }] = useChangeProfilePictMutation();
  const [imageName, setImageName] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<boolean>(false);
  const animationVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 100,
      },
    },
    close: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
    open1: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 100,
        delay: 200,
      },
    },
    close1: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        delay: 200,
      },
    },
  };

  useEffect(() => {
    if (error) {
      console.log("🚀 ~ FileUploader ~ error:", error);

      toast({
        title: "Error",
        description: "Something went wrong, try again later",
      });

      setUploadStatus(true);
      setTimeout(() => {
        setUploadStatus(false);
      }, 3000);
    }

    if (data) {
      console.log("🚀 ~ useEffect ~ data:", data);

      toast({
        title: "Success",
        description: "Profile picture updated",
      });

      setUploadStatus(true);
      setTimeout(() => {
        setUploadStatus(false);
      }, 3000);
    }

    if (isLoading) console.log("Uploading image...");
  }, [error, data, isLoading]);

  async function onSubmit(file: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: `${file.name} is not a valid image file`,
      });
      return;
    }

    setImageName(file.name);
    const formData = new FormData();
    formData.append("image", file);

    const token = await GetTokenCookies();
    formData.append("accessToken", token.data?.accessToken ?? "");

    upload(formData);
  }

  function handleDragEvent(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    onSubmit(file);
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const targetFile = e.target.files;
    if (targetFile) {
      const file = targetFile[0];
      onSubmit(file);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="transition-all duration-200">
        <motion.div
          initial="close"
          animate={open ? "open" : "close"}
          variants={animationVariants}
        >
          <div
            className="border-dashed m-2 rounded-lg border-2 flex items-center justify-center group/edit flex-col pb-2"
            onDragEnter={handleDragEvent}
            onDragOver={handleDragEvent}
            onDragLeave={handleDragEvent}
            onDrop={handleDrop}
          >
            <motion.div
              initial="close1"
              animate={open ? "open1" : "close"}
              variants={animationVariants}
              className="content relative flex justify-center items-center py-6"
            >
              <div className="img-1 group-hover/edit:-translate-y-1 transition-all duration-200">
                <Image
                  src={"/image.svg"}
                  alt="image"
                  width={60}
                  height={60}
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="img-1 w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 -z-10 group-hover/edit:translate-x-[0.6rem] group-hover/edit:rotate-12 transition-all duration-200">
                <Image
                  src={"/image.svg"}
                  alt="image"
                  width={50}
                  height={50}
                  style={{
                    objectFit: "cover",
                    opacity: 0.6,
                  }}
                />
              </div>
              <div className="img-1 w-full h-full absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/4 -z-10 group-hover/edit:-translate-x-[0.01rem] group-hover/edit:-rotate-12 transition-all duration-200">
                <Image
                  src={"/image.svg"}
                  alt="image"
                  width={50}
                  height={50}
                  style={{
                    objectFit: "cover",
                    opacity: 0.6,
                  }}
                />
              </div>
            </motion.div>
            <div className="text my-2 text-center space-y-2">
              <motion.p
                initial="close1"
                animate={open ? "open1" : "close"}
                variants={animationVariants}
                className="text-sm font-semibold"
              >
                Drop your files here, or{" "}
                <label className="text-blue-600 cursor-pointer">
                  browse{" "}
                  <input
                    type="file"
                    name="upload"
                    id="upload"
                    className="sr-only"
                    onChange={handleInput}
                  />
                </label>
              </motion.p>
              <motion.p
                initial="close1"
                animate={open ? "open1" : "close"}
                variants={animationVariants}
                className="font-semibold text-xs text-gray-600"
              >
                Supports: JPG, PNG, JPEG
              </motion.p>
            </div>
          </div>
          {(isLoading || uploadStatus) && (
            <motion.div
              initial="close"
              animate={open ? "open" : "close"}
              variants={animationVariants}
              className="uploading flex items-center justify-between px-4"
            >
              <p className="line-clamp-1">Uploading : {imageName}</p>
              <div className="icon">
                {isLoading && (
                  <TailSpin height={20} width={20} color="#3b82f6" />
                )}
                {data && <CircleCheck height={20} width={20} color="#3b82f6" />}
                {error && <CircleX height={20} width={20} color="#ef4444" />}
              </div>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploader;
