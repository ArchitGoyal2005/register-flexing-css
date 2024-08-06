"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignedIn, SignedOut, useSignUp } from "@clerk/nextjs";
import Spinner from "./components/Spinner";
import toast from "react-hot-toast";
import Manan_Logo from "@/public/Manan_Logo.png"
import Image from "next/image";
import { ExternalLink } from 'lucide-react';

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
    if (isSubmitting) return;
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
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border shadow-lg border-black/10 min-h-[90vh]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <p className="text-center text-lg font-bold text-black">
              Manan - A Techno Surge
            </p>
            <div className="flex justify-center">
              <Image src={Manan_Logo} className="w-[100px] h-[100px]" alt="Manan - A Techno Surge" />
            </div>
            <p className="text-center text-xs text-black font-semibold">
              presents
            </p>
            <h1 className="text-center text-3xl tracking-widest text-orange-600 font-semibold uppercase bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500">
              FlexMania
            </h1>
          </div>
          <SignedOut>
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
                placeholder="Enter Your Full Name"
                {...register("name", { required: "Name is required" })}
                className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Roll Number
              </label>
              <input
                id="rollNumber"
                placeholder="Enter Your Roll Number"
                {...register("rollNumber", {
                  required: "Roll Number is required",
                  validate: {
                    startsWith23or24: (value) =>
                      value.startsWith("23") ||
                      value.startsWith("22") ||
                      value.startsWith("24") ||
                      "Enter a valid roll number!!",
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
                htmlFor="PhoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="PhoneNumber"
                placeholder="Enter Your Phone Number"
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
                placeholder="College Id Only"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                    message: "Invalid email address",
                  },
                  validate: {
                    checkMail: (value) => {
                      const [roll, mail] = value.split("@");
                      return (
                        (roll === getValues("rollNumber") &&
                          mail === "jcboseust.ac.in") ||
                        "Invalid College ID"
                      );
                    },
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
                <option value="others">others</option>
              </select>
              {errors.course && (
                <p className="text-red-500 text-xs">{errors.course.message}</p>
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
                <option value="ELECTRICAL">ELECTRICAL</option>
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
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <input
                id="year"
                type="number"
                placeholder="Enter Your Year"
                {...register("year", {
                  required: "Year is required",
                  valueAsNumber: true,
                  max: 3,
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
              className="text-white w-full py-2 px-4 bg-indigo-500 rounded-md hover:bg-indigo-600"
              disabled={isSubmitting}
            >
              Register
            </button>
          </SignedOut>
          <SignedIn>
            <h6 className="text-center text-black text-lg font-bold py-7">
              Welcome Onboard!!!!
            </h6>
            <p className="text-green-600 font-semibold text-sm text-center pt-7">
              Join the WhatsApp group below for further information!!!
            </p>
            <p className="w-full text-center mt-4">
              <a
                className="text-blue-400 text-center w-full text-lg underline hover:text-blue-600"
                href="https://chat.whatsapp.com/Ev9FOhxTA9R94ihDpmMFsJ"
              >
                <span className="flex gap-2 items-center justify-center">
                  <ExternalLink />
                  FlexMania{" "}
                </span>
              </a>
            </p>
          </SignedIn>
        </form>
      </div>
    </div>
  );
}

export default Register;
