import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import bgImage from "../images/saajimage.avif";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password }, {withCredentials: true } );

      console.log('res.data', res.data)

      localStorage.setItem("auth", "true");  // 👈 add this
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.status === 200) {
        const user = res.data.user;
        console.log('res.satatus', res.status)
        // 👇 Redirect depending on level
        if (user.level === "Level 1") {
          navigate("/dashboard/profile");
        } else {
          navigate("/dashboard/profile");
        }
      }
      // redirect
    } catch (err) {
      // axios error handling
      if (err.response) {
        alert(err.response.data.error || "Login failed");
      } else {
        alert("Network error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div
  className="h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative"
  style={{ backgroundImage: `url(${bgImage})` }}
>
  {/* Login Card */}
  <div
    className="shadow-lg rounded-lg p-8 w-full max-w-md"
    style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
  >
    <h2 className="h2 text-center text-success fw-bold">SAAJ NAIROBI</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>

  {/* Footer */}
  <footer
    className="absolute bottom-2 text-center text-white w-full"
    style={{ fontSize: "0.8rem" }}
  >
    <p>Copyright &copy; {currentYear} All rights reserved</p>
    <p style={{ marginTop: "-0.3rem" }}>
      Powered by{" "}
      <a
        href="https://www.aptech.co.ke"
        className="fw-bold text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        AP Tech Kenya
      </a>
    </p>
  </footer>
</div>

  );
}
