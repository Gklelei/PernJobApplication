import { Navigate, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import HomePage from "./pages/NoneAdmin/Home";
import SignIn from "./pages/NoneAdmin/Auth/SignIn";
import SignUp from "./pages/NoneAdmin/Auth/SignUp";
import JobDetailsPage from "./pages/NoneAdmin/JobDetailsPage";
import { UseAppContext } from "./Context/AuthProvider";
import AdminLayout from "./Layout/Admin/Layout";
import Users from "./pages/Admin/users";
import Jobs from "./pages/Admin/Jobs";
import Applications from "./pages/Admin/Applications";
import UserProfilePage from "./pages/NoneAdmin/UserProfile";
import MainLayout from "./Layout/None-Admin/MainLayout";
import AllJobsSection from "./pages/NoneAdmin/AllJobs";
import ApplicationDetailsPage from "./components/None-Admin/ApplicationDetails";

const App = () => {
  const { isLoggedIn, isAdmin } = UseAppContext();
  return (
    <>
      <Routes>
        {/* ADMIN ROUTES */}
        {isAdmin && isLoggedIn && (
          <>
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <Admin />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <AdminLayout>
                  <Jobs />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminLayout>
                  <Users />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <AdminLayout>
                  <Applications />
                </AdminLayout>
              }
            />
          </>
        )}

        {/* NONE ADMIN ROUTES */}

        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        {/* AUTH */}
        {!isLoggedIn && (
          <>
            <Route
              path="/sign-in"
              element={
                <MainLayout>
                  <SignIn />{" "}
                </MainLayout>
              }
            />
            <Route
              path="/sign-up"
              element={
                <MainLayout>
                  <SignUp />
                </MainLayout>
              }
            />
          </>
        )}

        {/* JOBS ROUTE */}
        {isLoggedIn ? (
          <>
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <UserProfilePage />
                </MainLayout>
              }
            />

            <Route
              path="/application/:id"
              element={
                <MainLayout>
                  <ApplicationDetailsPage />
                </MainLayout>
              }
            />
          </>
        ) : (
          <>
            <Route
              path="/jobs/:id"
              element={
                <MainLayout>
                  <JobDetailsPage />
                </MainLayout>
              }
            />
            <Route
              path="/jobs"
              element={
                <MainLayout>
                  <AllJobsSection />
                </MainLayout>
              }
            />
          </>
        )}

        {/* CATCH ALL ROUTE */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
