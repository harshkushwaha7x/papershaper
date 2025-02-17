import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext)!;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error sending reset email. Please try again.");
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
            className="text-2xl lg:text-3xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Paper Shapers{" "}
            <span className="inline-block transform rotate-45">📝</span>
          </div>
          <div className="my-4 lg:my-8">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight lg:leading-snug">
              Reset Your Password
            </h1>
            <p className="text-base lg:text-lg mb-4 lg:mb-6">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/3 w-full flex flex-col justify-center items-center p-6 lg:p-10 bg-white lg:min-h-screen">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-semibold text-green-800 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600">
              Don't worry! We'll help you regain access to your account.
            </p>
          </div>

          {emailSent ? (
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Email Sent Successfully!
              </h3>
              <p className="text-gray-600">
                Check your inbox for password reset instructions. If you don't
                see it, check your spam folder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-700 text-white rounded-md font-semibold text-lg hover:bg-green-800 transition duration-300"
              >
                Send Reset Instructions
              </button>
            </form>
          )}

          <div className="text-center text-gray-600 mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-green-600 font-medium hover:text-green-700"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
