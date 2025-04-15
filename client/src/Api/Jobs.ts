const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
export const GettAllJobPostings = async () => {
  const response = await fetch(`${BASE_URL}/api/job/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error Fetching Job Postings");
  }
  const data = await response.json();
  return data.data;
};

export const GetJobById = async (id: string) => {
  console.log({ BASE_URL });
  const response = await fetch(`${BASE_URL}/api/job/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error Fetching Job Posting");
  }
  const data = await response.json();
  return data.data;
};

interface jobPosting {
  title: string;
  description: string;
  location: string;
  status: string;
  requirements: string;
  responsibilities: string;
  qualifications: string;
  skills: string;
  department: string;
  type: string;
  experience: string;
  salary: string;
  deadline: Date;
}

export const createJobPosting = async (formData: jobPosting) => {
  const response = await fetch(`${BASE_URL}/api/job/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error("Error Creating Job Posting");
  }
  const data = await response.json();
  return data.data;
};

export const DeleteJobPosting = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/job/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error Deleting Job Posting");
  }
  const data = await response.json();
  return data.data;
};
export interface jobPostingType {
  id: string;
  status: string;
}
export const UpdateJobPosting = async (formData: jobPostingType) => {
  const response = await fetch(`${BASE_URL}/api/job/update/${formData.id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: formData.status }),
  });
  if (!response.ok) {
    throw new Error("Error Updating Job Posting");
  }
  const data = await response.json();
  return data.data;
};
