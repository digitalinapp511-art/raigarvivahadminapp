import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users"));

    if (!users || users.length === 0) {
      const admin = [
        {
          id: 1,
          fullName: "Admin",
          email: "admin@example.com",
          password: "admin123",
          role: "admin",
          mobileNumber: "9999999999",
          selfieVerification: { status: "approved" },
          profileStatus: "completed",
        },
      ];

      localStorage.setItem("users", JSON.stringify(admin));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const admin = users.find(
      (u) =>
        u.email === form.email &&
        u.password === form.password &&
        u.role === "admin"
    );

    if (!admin) {
      alert("Only admin can login ❌");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(admin));
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="bg-white p-6 rounded-xl shadow w-[350px]">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            name="email"
            placeholder="Admin Email"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button className="bg-blue-500 text-white py-2 rounded">
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p><b>Demo Admin:</b></p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;