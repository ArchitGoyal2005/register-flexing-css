"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import Spinner from "./components/Spinner";
import toast from "react-hot-toast";

interface IFormInputs {
  rollNumber: string;
  name: string;
  PhoneNumber: string;
  email: string;
  branch: string;
  course: string;
  year: number;
  dob: string;
}

function Register() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IFormInputs>();

  if (!isLoaded) {
    return <Spinner />;
  }

  const onSubmit: SubmitHandler<IFormInputs> = async () => {
    try {
      setIsSubmitting(true);
      const data = await signUp.create({
        username: `${getValues("name")[0]}-${getValues("rollNumber")}`,
        password: getValues("dob"),
        emailAddress: getValues("email"),
        firstName: getValues("name"),
        unsafeMetadata: {
          rollNumber: getValues("rollNumber"),
          contact: getValues("PhoneNumber"),
          branch: getValues("branch"),
          year: getValues("year"),
          course: getValues("course"),
        },
      });
      setActive({ session: data.createdSessionId });
      toast.success("Registered Successsfully!!!!");
    } catch (error) {
      toast.error("Sign up failed!! Please try again after some time!!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <form
          onSubmit={() => {
            if (isSubmitting) return;
            handleSubmit(onSubmit);
          }}
          className="space-y-4"
        >
          <h1 className="text-black text-center text-3xl">Register</h1>
          <div>
            <label
              htmlFor="rollNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Roll Number
            </label>
            <input
              id="rollNumber"
              {...register("rollNumber", {
                required: "Roll Number is required",
                validate: {
                  startsWith23or24: (value) =>
                    value.startsWith("23") ||
                    value.startsWith("24") ||
                    "Roll Number must begin with 23 or 24",
                  lengthIs11: (value) =>
                    value.length === 11 ||
                    "Roll Number must be 11 characters long",
                  mustHaveOnlyDigits: (value) => {
                    const regex = /^\d+$/;
                    return (
                      regex.test(value) ||
                      "Roll Number must contain only digits"
                    );
                  },
                },
              })}
              className="text-black block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.rollNumber && (
              <p className="text-red-500 text-xs">
                {errors.rollNumber.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              {...register("dob", {
                required: "Date of Birth is required",
                setValueAs: (value) => {
                  if (value) {
                    const [year, month, day] = value.split("-");
                    return `${day}-${month}-${year}`;
                  }
                  return value;
                },
              })}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.dob && (
              <p className="text-red-500 text-xs">{errors.dob.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="PhoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="PhoneNumber"
              {...register("PhoneNumber", {
                required: "Phone Number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid phone number. Must be 10 digits.",
                },
              })}
              className="text-black block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.PhoneNumber && (
              <p className="text-red-500 text-xs">
                {errors.PhoneNumber.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                  message: "Invalid email address",
                },
              })}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-gray-700"
            >
              Branch
            </label>
            <select
              id="branch"
              {...register("branch", { required: "Branch is required" })}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select your Branch</option>
              <option value="CE">CE</option>
              <option value="IT">IT</option>
              <option value="CEDS">CEDS</option>
              <option value="ECE">ECE</option>
              <option value="ENC">ENC</option>
              <option value="IOT">IOT</option>
              <option value="MECHANICAL">MECHANICAL</option>
              <option value="CIVIL">CIVIL</option>
              <option value="NA">Not Applicable</option>
            </select>
            {errors.branch && (
              <p className="text-red-500 text-xs">{errors.branch.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700"
            >
              Course
            </label>
            <select
              id="course"
              {...register("course", { required: "Course is required" })}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select your course</option>
              <option value="Btech">B.Tech</option>
              <option value="BCA">BCA</option>
            </select>
            {errors.course && (
              <p className="text-red-500 text-xs">{errors.course.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700"
            >
              Year
            </label>
            <input
              id="year"
              type="number"
              {...register("year", {
                required: "Year is required",
                valueAsNumber: true,
                max: 2,
                min: 1,
              })}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.year && (
              <p className="text-red-500 text-xs">{errors.year.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="text-white w-full py-2 px-4 bg-customRed rounded-md hover:bg-red-600"
            disabled={isSubmitting}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
