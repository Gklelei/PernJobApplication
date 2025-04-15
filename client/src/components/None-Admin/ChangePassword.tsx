import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { UseChangeUserPassword } from "@/Api/user";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal = ({
  open,
  onOpenChange,
}: ChangePasswordModalProps) => {
  const [isConfirming, setIsConfirming] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const { changePassword, isPending } = UseChangeUserPassword();

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      const data = {
        password: currentPassword,
        newPassword,
      };
      await changePassword(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    }
  };

  const resetState = () => {
    setIsConfirming(true);
    setCurrentPassword("");
    setNewPassword("");
    setError("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) resetState();
        onOpenChange(open);
      }}
    >
      <DialogContent className="bg-gray-800 border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-200">
            {isConfirming ? "Change Password?" : "Set New Password"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isConfirming
              ? "Are you sure you want to change your password?"
              : "Please enter your current and new password"}
          </DialogDescription>
        </DialogHeader>

        {!isConfirming && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-gray-300">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-gray-300">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <ShieldAlert className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {isConfirming ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsConfirming(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsConfirming(true)}
                className="border-gray-600 text-gray-300"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
