import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  FileText,
  Lock,
  File,
  Crown,
  VenusAndMarsIcon,
  Upload,
  Edit,
  Save,
  X,
  User,
  Loader,
} from "lucide-react";
import { format } from "date-fns";
import { UseAppContext } from "@/Context/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUserApplications, UseClientUpdateProfile } from "@/Api/user";
import ChangePasswordModal from "@/components/None-Admin/ChangePassword";
import {
  UseUpdateCv,
  UseUpdateCoverLetter,
  UseUpdateProfileImage,
} from "@/Api/Uploads";
import { useNavigate } from "react-router-dom";

interface JobApplicationsType {
  id: string;
  title: string;
  department: string;
  appliedDate: Date;
  type: string;
  status: string;
}

const UserProfilePage = () => {
  const router = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = UseAppContext();
  const [image, setImage] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    gender: user?.gender || "",
  });

  const { updateProfile, isLoading: IsUpdateLoading } =
    UseClientUpdateProfile();
  const { UploadCv, isPending: isCvPending } = UseUpdateCv();
  const { UploadCoverLetter, isPending: isClPending } = UseUpdateCoverLetter();
  const { UploadProfileImage, isPending: isImagePending } =
    UseUpdateProfileImage();

  const { data, isLoading } = useQuery<JobApplicationsType[]>({
    queryKey: ["GetUserJobApplications"],
    queryFn: GetUserApplications,
    retry: 1,
  });

  useEffect(() => {
    if (user?.imageUrl) {
      setImage(user.imageUrl);
    }
  }, [user]);

  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);

      try {
        await UploadProfileImage({ file });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } catch (error) {
        setImage(user?.imageUrl || "");
        console.log({ error });
      }
    }
  };

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleDocUpload =
    (type: "cv" | "coverLetter") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        try {
          const uploader = type === "cv" ? UploadCv : UploadCoverLetter;
          await uploader({ file });
          queryClient.invalidateQueries({ queryKey: ["user"] });
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updateProfile(formData);
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    setIsEditing(false);
  };

  if (!user)
    return <p className="p-10 text-center text-gray-300">Loading profile...</p>;
  if (isLoading)
    return (
      <p className="p-10 text-center text-gray-300">Loading applications...</p>
    );
  if (!data)
    return (
      <p className="p-10 text-center text-gray-300">No Applications Found</p>
    );

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10 w-full">
      <div className="max-w-5xl mx-auto space-y-8 w-full">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
          <div className="relative group">
            <div
              className="h-32 w-32 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 
        flex items-center justify-center cursor-pointer overflow-hidden shadow-xl"
              onClick={handleImageClick}
            >
              {image ? (
                <img
                  src={image}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-200" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                {isImagePending ? (
                  <Loader className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isImagePending}
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-4">
              {isEditing ? (
                <div className="flex gap-3">
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="w-40 bg-gray-800 border-gray-700 text-white"
                  />
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="w-40 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              ) : (
                <h1 className="text-3xl font-bold text-gray-100">
                  {user.firstName} {user.lastName}
                </h1>
              )}
              <Badge className="h-8 px-3 py-1 bg-gray-800 text-purple-400 border border-gray-700">
                {user.role || "User"}
              </Badge>
            </div>

            <p className="text-gray-400">{user.email}</p>

            <div className="flex items-center gap-3">
              <Badge
                variant={user.plan === "premium" ? "default" : "secondary"}
                className="bg-gray-800 text-blue-400"
              >
                {user.plan} Plan
              </Badge>
              <span className="text-sm text-gray-500">
                Member since {format(user.createdAt, "MMM yyyy")}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  {IsUpdateLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                <Edit className="h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-transparent p-0 gap-4 border-b border-gray-800 rounded-none">
            <TabsTrigger
              value="details"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 px-1 pb-3 rounded-none text-gray-400"
            >
              <FileText className="h-4 w-4 mr-2" /> Details
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 px-1 pb-3 rounded-none text-gray-400"
            >
              <Briefcase className="h-4 w-4 mr-2" /> Applications ({data.length}
              )
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Card */}
              <Card className="p-6 bg-gray-800 border-gray-700 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <VenusAndMarsIcon className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-200">
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400">Gender</Label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-300">
                        {user.gender || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Documents Card */}
              <Card className="p-6 bg-gray-800 border-gray-700 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <File className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-200">
                    Documents
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400">CV</Label>
                    <div className="mt-1 flex items-center gap-3">
                      {isEditing ? (
                        <div className="w-full">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleDocUpload("cv")}
                            className="hidden"
                            id="cvUpload"
                            disabled={isCvPending}
                          />
                          <Label
                            htmlFor="cvUpload"
                            className="cursor-pointer flex items-center gap-2 text-blue-400 hover:text-blue-300"
                          >
                            {isCvPending ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            {isCvPending
                              ? "Uploading CV..."
                              : "Upload new CV (PDF)"}
                          </Label>
                        </div>
                      ) : (
                        <a
                          href={user.cvUrl}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4" />
                          View Current CV
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400">
                      Cover Letter
                    </Label>
                    <div className="mt-1 flex items-center gap-3">
                      {isEditing ? (
                        <div className="w-full">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleDocUpload("coverLetter")}
                            className="hidden"
                            id="clUpload"
                            disabled={isClPending}
                          />
                          <Label
                            htmlFor="clUpload"
                            className="cursor-pointer flex items-center gap-2 text-blue-400 hover:text-blue-300"
                          >
                            {isClPending ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            {isClPending
                              ? "Uploading Cover Letter..."
                              : "Upload new Cover Letter (PDF)"}
                          </Label>
                        </div>
                      ) : (
                        <a
                          href={user.coverLetterUrl}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          View Current Cover Letter
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Security Card */}
              <Card className="p-6 bg-gray-800 border-gray-700 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-200">
                    Security
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400">
                      Last Updated
                    </Label>
                    <p className="mt-1 text-gray-300">
                      {format(user.updatedAt, "PPP")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Change Password
                  </Button>
                  <ChangePasswordModal
                    open={isPasswordModalOpen}
                    onOpenChange={setIsPasswordModalOpen}
                  />
                </div>
              </Card>

              {/* Subscription Card */}
              <Card className="p-6 bg-gray-800 border-gray-700 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-200">
                    Subscription
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400">
                      Current Plan
                    </Label>
                    <p className="mt-1 text-gray-300 capitalize">{user.plan}</p>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    variant={user.plan === "premium" ? "default" : "outline"}
                  >
                    {user.plan === "premium"
                      ? "Manage Plan"
                      : "Upgrade to Premium"}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="pt-6">
            <Card className="bg-gray-800 border-gray-700 shadow-xl">
              {data.map((application) => (
                <div
                  key={application.id}
                  className="p-6 hover:bg-gray-700/30 transition-colors border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-200">
                        {application.title}
                      </h4>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className="bg-gray-900 text-gray-300 border-gray-700">
                          {application.department}
                        </Badge>
                        <Badge className="bg-gray-900 text-gray-300 border-gray-700">
                          {application.type}
                        </Badge>
                        <Badge
                          variant={
                            application.status === "accepted"
                              ? "default"
                              : application.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                          className="border-gray-700"
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        Applied{" "}
                        {format(application.appliedDate, "MMM dd, yyyy")}
                      </p>
                      <Button
                        variant="link"
                        className="text-blue-400 mt-2 cursor-pointer"
                        onClick={() => router(`/application/${application.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;
