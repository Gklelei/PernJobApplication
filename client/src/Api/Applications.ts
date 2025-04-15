import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./Auth";

export const GetJobApplications = async () => {
  const response = await fetch(`${BASE_URL}/api/application/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error Fetching Job Applications");
  }
  const data = await response.json();
  return data;
};

export const CreateJobApplication = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/application/create/${id}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error Creating Job Posting");
  }
  const data = await response.json();
  return data;
};

export interface updateType {
  status: "Applied" | "Screening" | "Interview" | "Rejected" | "Accepted";
  id: string;
}

export const UpdateJobApplications = async (formData: updateType) => {
  const response = await fetch(
    `${BASE_URL}/api/application/update/${formData.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: formData.status, // Send the status as part of an object
        // Include the ID to identify the application
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Error Updating Job Application");
  }

  const data = await response.json();
  return data;
};

export const DeleteJobApplications = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/application/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error Deleting Job Application");
  }

  const data = await response.json();
  return data;
};

type ApplicationData = {
  id: string;
  title: string;
  department: string;
  appliedDate: string;
  type: string;
  status: string;
  cv: string;
  coverLetter: string;
  jobDescription: string;
  skills: string;
  sallary: string;
  qualifications: string;
};

export const USeGetJobApplicationById = (id: string) => {
  const GetJobApplicationById = async () => {
    const response = await fetch(`${BASE_URL}/api/application/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error Fetching Job Application");
    }
    return data.data;
  };

  const { data: application } = useQuery<ApplicationData[]>({
    queryKey: ["GetJobApplicationById", id],
    queryFn: GetJobApplicationById,
  });
  return {
    application,
  };
};
