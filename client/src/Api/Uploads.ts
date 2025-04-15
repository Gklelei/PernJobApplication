import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "./Auth";
import { toast } from "sonner";

type UploadType = {
  file: File;
};

export const UseUpdateCv = () => {
  const UploadandUpdateCv = async ({ file }: UploadType) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/api/uploads/upload-cv`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error uploading file");
    }

    return data;
  };

  const { mutateAsync: UploadCv, isPending } = useMutation({
    mutationFn: UploadandUpdateCv,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { UploadCv, isPending };
};
export const UseUpdateCoverLetter = () => {
  const UploadandUpdateCoverLetter = async ({ file }: UploadType) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${BASE_URL}/api/uploads/upload-cover-letter`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error uploading file");
    }

    return data;
  };

  const { mutateAsync: UploadCoverLetter, isPending } = useMutation({
    mutationFn: UploadandUpdateCoverLetter,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { UploadCoverLetter, isPending };
};
export const UseUpdateProfileImage = () => {
  const UploadandUpdateCoverLetter = async ({ file }: UploadType) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${BASE_URL}/api/uploads/upload-profile-image`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error uploading file");
    }

    return data;
  };

  const { mutateAsync: UploadProfileImage, isPending } = useMutation({
    mutationFn: UploadandUpdateCoverLetter,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { UploadProfileImage, isPending };
};
