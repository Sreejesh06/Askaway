import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 mt-20">
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <Link
              to="/logout"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium text-white"
            >
              Logout
            </Link>
          </div>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={handleUploadClick}
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              Click the camera icon to upload your profile picture
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
              <p className="text-gray-600">Name: John Doe</p>
              <p className="text-gray-600">Email: john.doe@example.com</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-700">Account Settings</h3>
              <p className="text-gray-600">Language: English</p>
              <p className="text-gray-600">Time Zone: UTC-5</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Preferences</h3>
              <p className="text-gray-600">Email Notifications: Enabled</p>
              <p className="text-gray-600">Two-Factor Authentication: Disabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;