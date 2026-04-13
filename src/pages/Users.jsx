import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const filteredUsers = useMemo(() => {
    const s = search.toLowerCase();

    return users.filter((u) => {
      const name = u.fullName?.toLowerCase() || "";
      const email = u.email?.toLowerCase() || "";
      const mobile = u.mobileNumber || "";
      const gender = u.gender?.toLowerCase() || "";
      const status = u.selfieVerification?.status?.toLowerCase() || "";
      const profileStatus = u.profileStatus?.toLowerCase() || "";

      return (
        name.includes(s) ||
        email.includes(s) ||
        mobile.includes(search) ||
        gender.includes(s) ||
        status.includes(s) ||
        profileStatus.includes(s)
      );
    });
  }, [users, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleDelete = (id) => {
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);

    if (viewUser?.id === id) setViewUser(null);
    if (editUser?.id === id) {
      setEditUser(null);
      setFormData({});
    }
  };

  const toggleApproval = (id) => {
    const updated = users.map((u) =>
      u.id === id
        ? {
            ...u,
            selfieVerification: {
              ...u.selfieVerification,
              status:
                u.selfieVerification?.status === "approved"
                  ? "pending"
                  : "approved",
            },
          }
        : u
    );

    saveUsers(updated);

    if (viewUser?.id === id) {
      const updatedUser = updated.find((u) => u.id === id);
      setViewUser(updatedUser || null);
    }

    if (editUser?.id === id) {
      const updatedUser = updated.find((u) => u.id === id);
      setEditUser(updatedUser || null);
      setFormData(updatedUser || {});
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      ...user,
      religionDetails: {
        caste: user.religionDetails?.caste || "",
        subCaste: user.religionDetails?.subCaste || "",
        dosham: user.religionDetails?.dosham || "Don't Know",
      },
      professionalDetails: {
        highestEducation: user.professionalDetails?.highestEducation || "",
        employedIn: user.professionalDetails?.employedIn || "",
        occupation: user.professionalDetails?.occupation || "",
        annualIncome: user.professionalDetails?.annualIncome || "",
        workLocation: user.professionalDetails?.workLocation || "",
        state: user.professionalDetails?.state || "",
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const updateUser = (e) => {
    e.preventDefault();

    if (!editUser) return;

    const updated = users.map((u) =>
      u.id === editUser.id
        ? {
            ...u,
            ...formData,
            email: formData.email?.trim()?.toLowerCase() || "",
          }
        : u
    );

    saveUsers(updated);
    setEditUser(null);
    setFormData({});
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Users List</h2>

            <input
              type="text"
              placeholder="Search by name, email, mobile, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Gender</th>
                  <th className="p-3 text-left">Profile</th>
                  <th className="p-3 text-left">Verify</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-t border-gray-200">
                      <td className="p-3">{user.fullName || "-"}</td>
                      <td className="p-3">{user.mobileNumber || "-"}</td>
                      <td className="p-3">{user.email || "-"}</td>
                      <td className="p-3">{user.gender || "-"}</td>

                      <td className="p-3">
                        <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 capitalize">
                          {user.profileStatus || "incomplete"}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs text-white rounded capitalize ${
                            user.selfieVerification?.status === "approved"
                              ? "bg-green-500"
                              : user.selfieVerification?.status === "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {user.selfieVerification?.status || "pending"}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleApproval(user.id)}
                            className={`px-3 py-1 text-xs text-white rounded ${
                              user.selfieVerification?.status === "approved"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          >
                            {user.selfieVerification?.status === "approved"
                              ? "Unapprove"
                              : "Approve"}
                          </button>

                          <button
                            onClick={() => setViewUser(user)}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleEdit(user)}
                            className="px-3 py-1 text-xs bg-orange-500 text-white rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {viewUser && (
          <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
            onClick={() => setViewUser(null)}
          >
            <div
              className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">User Details</h2>

              <div className="space-y-5 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Basic Info</h3>
                  <p><b>Profile:</b> {viewUser.profile || "-"}</p>
                  <p><b>Full Name:</b> {viewUser.fullName || "-"}</p>
                  <p><b>Mobile:</b> {viewUser.mobileNumber || "-"}</p>
                  <p><b>Email:</b> {viewUser.email || "-"}</p>
                  <p><b>Gender:</b> {viewUser.gender || "-"}</p>
                  <p><b>Age:</b> {viewUser.age || "-"}</p>
                  <p><b>Date of Birth:</b> {viewUser.dateOfBirth?.slice?.(0, 10) || "-"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Religion Details</h3>
                  <p><b>Caste:</b> {viewUser.religionDetails?.caste || "-"}</p>
                  <p><b>Sub Caste:</b> {viewUser.religionDetails?.subCaste || "-"}</p>
                  <p><b>Dosham:</b> {viewUser.religionDetails?.dosham || "-"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Details</h3>
                  <p><b>Marital Status:</b> {viewUser.personalDetails?.maritalStatus || "-"}</p>
                  <p><b>No. of Children:</b> {viewUser.personalDetails?.noOfChildren ?? "-"}</p>
                  <p>
                    <b>Children Living With You:</b>{" "}
                    {viewUser.personalDetails?.childrenLivingWithYou === true
                      ? "Yes"
                      : viewUser.personalDetails?.childrenLivingWithYou === false
                      ? "No"
                      : "-"}
                  </p>
                  <p><b>Height:</b> {viewUser.personalDetails?.height || "-"}</p>
                  <p><b>Family Status:</b> {viewUser.personalDetails?.familyStatus || "-"}</p>
                  <p><b>Family Type:</b> {viewUser.personalDetails?.familyType || "-"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Details</h3>
                  <p><b>Highest Education:</b> {viewUser.professionalDetails?.highestEducation || "-"}</p>
                  <p><b>Employed In:</b> {viewUser.professionalDetails?.employedIn || "-"}</p>
                  <p><b>Occupation:</b> {viewUser.professionalDetails?.occupation || "-"}</p>
                  <p><b>Annual Income:</b> {viewUser.professionalDetails?.annualIncome || "-"}</p>
                  <p><b>Work Location:</b> {viewUser.professionalDetails?.workLocation || "-"}</p>
                  <p><b>State:</b> {viewUser.professionalDetails?.state || "-"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About Yourself</h3>
                  <p><b>Bio:</b> {viewUser.aboutYourself?.bio || "-"}</p>

                  {viewUser.aboutYourself?.images?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {viewUser.aboutYourself.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`profile-${i}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Selfie Verification</h3>
                  <p><b>Status:</b> {viewUser.selfieVerification?.status || "-"}</p>
                  <p><b>Submitted At:</b> {viewUser.selfieVerification?.submittedAt?.slice?.(0, 10) || "-"}</p>
                  <p><b>Reviewed At:</b> {viewUser.selfieVerification?.reviewedAt?.slice?.(0, 10) || "-"}</p>
                  <p><b>Remark:</b> {viewUser.selfieVerification?.reviewRemark || "-"}</p>

                  {viewUser.selfieVerification?.selfieImageUrl && (
                    <img
                      src={viewUser.selfieVerification.selfieImageUrl}
                      alt="selfie"
                      className="mt-3 w-32 h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Profile Progress</h3>
                  <p><b>Completed Steps:</b> {viewUser.profileCompletedSteps ?? 0}</p>
                  <p><b>Profile Status:</b> {viewUser.profileStatus || "-"}</p>
                </div>
              </div>

              <button
                onClick={() => setViewUser(null)}
                className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {editUser && (
          <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
            onClick={() => {
              setEditUser(null);
              setFormData({});
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Edit User</h2>

              <form onSubmit={updateUser} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border p-2 rounded"
                />

                <input
                  name="mobileNumber"
                  value={formData.mobileNumber || ""}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="border p-2 rounded"
                />

                <input
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border p-2 rounded"
                />

                <input
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  placeholder="Gender"
                  className="border p-2 rounded"
                />

                <input
                  name="age"
                  value={formData.age || ""}
                  onChange={handleChange}
                  placeholder="Age"
                  className="border p-2 rounded"
                />

                <input
                  name="profile"
                  value={formData.profile || ""}
                  onChange={handleChange}
                  placeholder="Profile"
                  className="border p-2 rounded"
                />

                <input
                  value={formData.religionDetails?.caste || ""}
                  onChange={(e) =>
                    handleNestedChange("religionDetails", "caste", e.target.value)
                  }
                  placeholder="Caste"
                  className="border p-2 rounded"
                />

                <input
                  value={formData.religionDetails?.subCaste || ""}
                  onChange={(e) =>
                    handleNestedChange("religionDetails", "subCaste", e.target.value)
                  }
                  placeholder="Sub Caste"
                  className="border p-2 rounded"
                />

                <input
                  value={formData.professionalDetails?.occupation || ""}
                  onChange={(e) =>
                    handleNestedChange("professionalDetails", "occupation", e.target.value)
                  }
                  placeholder="Occupation"
                  className="border p-2 rounded"
                />

                <input
                  value={formData.professionalDetails?.highestEducation || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "professionalDetails",
                      "highestEducation",
                      e.target.value
                    )
                  }
                  placeholder="Highest Education"
                  className="border p-2 rounded"
                />

                <input
                  value={formData.professionalDetails?.workLocation || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "professionalDetails",
                      "workLocation",
                      e.target.value
                    )
                  }
                  placeholder="Work Location"
                  className="border p-2 rounded"
                />

                <input
                  value={formData.professionalDetails?.state || ""}
                  onChange={(e) =>
                    handleNestedChange("professionalDetails", "state", e.target.value)
                  }
                  placeholder="State"
                  className="border p-2 rounded"
                />

                <div className="md:col-span-2">
                  <textarea
                    value={formData.aboutYourself?.bio || ""}
                    onChange={(e) =>
                      handleNestedChange("aboutYourself", "bio", e.target.value)
                    }
                    placeholder="Bio"
                    rows="4"
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 rounded"
                  >
                    Update User
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditUser(null);
                      setFormData({});
                    }}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Users;