import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "./Auth";
import { toast } from "sonner";

export const GetUserRole = async () => {
  const response = await fetch(`${BASE_URL}/api/profile/role`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error Fetching user role");
  }
  const data = await response.json();
  return data;
};

export const GetLoggedInUser = async () => {
  const response = await fetch(`${BASE_URL}/api/profile/user`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error Fetching user role");
  }
  const data = await response.json();
  return data;
};

export const GetAllUsers = async () => {
  const response = await fetch(`${BASE_URL}/api/users/all`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response) {
    throw new Error("Error Fetching all users");
  }

  const data = await response.json();

  return data.data;
};

export const GetUserApplications = async () => {
  const response = await fetch(`${BASE_URL}/api/users/applications`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "appliction/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error Fetching Job Applications");
  }
  const data = await response.json();
  return data.data;
};

interface userFormDataType {
  role: "admin" | "user";
  id: string;
}

export const UPdateCurrentUser = async (formData: userFormDataType) => {
  const response = await fetch(`${BASE_URL}/api/profile/update`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error("Error Updating user");
  }
  const data = await response.json();
  return data;
};

interface formData {
  id: string;
}

export const DeleteUser = async (requestData: formData) => {
  const response = await fetch(`${BASE_URL}/api/profile/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    throw new Error("Error Deleting User");
  }
  const data = response.json();
  return data;
};

interface changePasswordType {
  password: string;
  newPassword: string;
}

interface returnType {
  message: string;
}

export const UseChangeUserPassword = () => {
  const ChangeUserPassword = async (
    formData: changePasswordType
  ): Promise<returnType> => {
    const response = await fetch(`${BASE_URL}/api/users/forget-password`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Error changing password");
    }

    return data;
  };

  const { mutateAsync: changePassword, isPending } = useMutation<
    returnType,
    Error,
    changePasswordType
  >({
    mutationFn: ChangeUserPassword,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    changePassword,
    isPending,
  };
};

interface clientUpadetType {
  firstName: string;
  lastName: string;
  gender: string;
}

export const UseClientUpdateProfile = () => {
  const updateClientProfile = async (formData: clientUpadetType) => {
    const response = await fetch(`${BASE_URL}/api/profile/update`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Error updating client profile");
    }

    return data;
  };
  const { isPending: isLoading, mutateAsync: updateProfile } = useMutation({
    mutationFn: updateClientProfile,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    isLoading,
    updateProfile,
  };
};
