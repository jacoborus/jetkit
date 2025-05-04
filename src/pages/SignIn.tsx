import React, { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate, Link } from "react-router";

export default function LoginForm() {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  if (authStore.isLoggedIn) {
    navigate("/");
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authStore.signIn(formData.email, formData.password);
  };

  return (
    <div className="min-w-screen min-h-screen hero bg-base-200">
      <div className="hero-content flex-col">
        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title justify-center mb-3">
              Login to your account
            </h2>

            <form onSubmit={handleSubmit}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-lg">E-Mail</legend>
                <input
                  type="email"
                  id="email"
                  placeholder="Your e-mail"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input input-lg"
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend text-lg">Password</legend>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input input-lg"
                  required
                />
              </fieldset>

              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Sign In
                </button>
              </div>
            </form>
          </div>
          <div className="divider"></div>
          <div className='flex flex-col place-items-center pb-8'>
            <h3 className='text-lg mb-3'>Need an account?</h3>
            <Link className='btn btn-md ' to='/sign-up'>Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
