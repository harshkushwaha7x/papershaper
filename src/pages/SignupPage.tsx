// src/pages/SignupPage.tsx
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, sendVerificationEmail } = useContext(AuthContext)!;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      const result = await signup(data.email, data.password);
      if (result.success) {
        setEmailSent(true);
        toast.success(result.message);
      } else {
        throw new Error(result.error as string);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
  };

  const handleResendEmail = async () => {
    try {
      await sendVerificationEmail();
      toast.success("Verification email resent!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Failed to resend verification email");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side - Image and Text */}
      <div
        className="lg:w-2/3 w-full h-64 lg:h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/5710614/pexels-photo-5710614.jpeg?auto=compress&cs=tinysrgb&w=800')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative flex flex-col justify-center h-full px-6 lg:px-10 text-white z-10">
          <div
            className="text-2xl lg:text-3xl font-bold cursor-pointer mb-4"
            onClick={() => navigate("/")}
          >
            Paper Shapers{" "}
            <span className="inline-block transform rotate-45">📝</span>
          </div>
          <div className="my-4 lg:my-8">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight lg:leading-snug">
              Join Paper Shapers
            </h1>
            <p className="text-base lg:text-lg mb-4 lg:mb-6">
              Start generating AI-powered mock papers for classes 9, 10, and 12
              with ease. Enhance your preparation and stay ahead.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="lg:w-1/3 w-full flex flex-col justify-center items-center p-6 lg:p-10 bg-white lg:min-h-screen">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8 text-green-800 text-center">
          {emailSent ? "Verify Your Email" : "Create your account"}
        </h2>

        {emailSent ? (
          <div className="w-full max-w-md space-y-6 text-center">
            <p className="text-gray-600 mb-6">
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>
            <button
              onClick={handleResendEmail}
              className="w-full py-3 bg-green-700 text-white rounded-md font-semibold text-base lg:text-lg hover:bg-green-800 transition duration-300"
            >
              Resend Verification Email
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Already verified? Login here
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4 lg:space-y-5"
          >
            <div>
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm lg:text-base"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm lg:text-base"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm lg:text-base"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm lg:text-base"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-700 text-white rounded-md font-semibold text-base lg:text-lg hover:bg-green-800 transition duration-300 mt-4 lg:mt-6"
            >
              Sign Up
            </button>
          </form>
        )}
        {!emailSent && (
          <div className="text-center text-gray-600 mt-6 lg:mt-8 text-sm lg:text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-medium ml-1 lg:ml-2 hover:text-green-700"
            >
              Login here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
