import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, notification } from "antd";
import { doUpdateUserInfoAction } from "../../redux/account/accountSlice.js";
import { callChangePassword, callUpdateProfile } from "../../services/api.js";

const EditProfile = () => {
    const dispatch = useDispatch();
    const { user, isLoading, isAuthenticated } = useSelector((state) => state.account);

    // Local state for tabs
    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState({
        id: user.id,
        name: user?.name || "",
        email: user?.email || "",
        firstName: user?.firstName || "",
    });
    const [passwordData, setPasswordData] = useState({
        id: user?.id,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Handlers for switching tabs
    const handleTabSwitch = (tab) => setActiveTab(tab);

    // Handle profile update
    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!profileData.name || !profileData.firstName) {
            message.error("Please fill in all fields");
            return;
        }

        try {
            await callUpdateProfile(profileData);
            dispatch(doUpdateUserInfoAction(profileData));
            message.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            message.error("Failed to update profile");
        }
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordData.confirmPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            message.error("Please fill in all fields");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            message.error("Passwords do not match!");
            return;
        }

        try {
            const res = await callChangePassword(passwordData);

            if (res?.data) {
                message.success("Password updated successfully!");
            } else {
                notification.error({
                    message: "Error",
                    description: res.message,
                });
            }
        } catch (error) {
            console.error("Error updating change password:", error);
            message.error("Failed to update password");
        }
    };

    if (isLoading) return <div className="text-center text-lg font-semibold py-8">Loading...</div>;

    return (
        <>
            {isAuthenticated && (
                <div className="container mx-auto px-4 py-10">
                    {/* Tabs Navigation */}
                    <div className="flex justify-center gap-6 mb-6">
                        <button
                            className={`px-6 py-3 font-semibold rounded-full transition ${
                                activeTab === "profile"
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                            onClick={() => handleTabSwitch("profile")}
                        >
                            Edit Profile
                        </button>
                        <button
                            className={`px-6 py-3 font-semibold rounded-full transition ${
                                activeTab === "password"
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                            onClick={() => handleTabSwitch("password")}
                        >
                            Change Password
                        </button>
                    </div>

                    {/* Tabs Content */}
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg mx-auto border border-gray-200">
                        {activeTab === "profile" ? (
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold text-center text-gray-700">Edit Profile</h2>
                                <div className="relative">
                                    <label className="block text-gray-600 font-medium mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleProfileChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-gray-600 font-medium mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-gray-600 font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-md hover:from-indigo-500 hover:to-blue-500 transition"
                                >
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold text-center text-gray-700">Change Password</h2>
                                <div className="relative">
                                    <label className="block text-gray-600 font-medium mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-gray-600 font-medium mb-2">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-gray-600 font-medium mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-md hover:from-indigo-500 hover:to-blue-500 transition"
                                >
                                    Change Password
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default EditProfile;
