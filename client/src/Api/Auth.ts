interface AuthProps {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface message {
  message: string;
}

export const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const userRegistration = async (
  formData: AuthProps
): Promise<message> => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error("SignIn Error");
  }
  const responseJson = await response.json();

  return responseJson;
};

export const userSignIn = async (
  formData: Pick<AuthProps, "email" | "password">
): Promise<message> => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error("Login Error");
  }
  const responseJson = await response.json();

  return responseJson;
};

export const vallidateToken = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/validate-token`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Invalid Token");
  }
  return response.json();
};

export const Signout = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/signout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout Error!");
  }
};
