import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
// import logo from "../data/dtslogo.png";
import { useLoginMutation } from "api/useApi";
import { useAuth } from "contexts/AuthProvider";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbRuler2 } from "react-icons/tb";

const schema = z.object({
  username: z.string().min(3, "Email is required"),
  password: z.string().min(3, "Password is required"),
});

const { Group, Control, Label } = Form;

const Login = () => {
  const { login, accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { mutate: loginMutate, isLoading: spinLoading } = useLoginMutation({
    onSuccess: (data, variables, context) => {
      login(data.token);
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error(error);
      // toast.error(error.response.data);
      // toast.error(error.response.data.errors.UserName[0]);
    },
  });

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    const { username, password } = data;
    const reqData = { username, password };
    loginMutate(reqData);
  };

  if (accessToken) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <Loader />;
  }


  return (
    <div className="login-form">
      <div className="main">
        {/* <div className="logo-container">
          <img src={logo} alt="DTS" className="logo" />
        </div> */}
        <p className="sign" align="center">
          Login Your Account
        </p>
        <form
          className="form1"
          onSubmit={handleSubmit((data) => onSubmit(data))}
        >
          <Group className="form-floating">
            <Control
              id="inputUserName"
              className="form-control"
              type="email"
              {...register("username")}
              placeholder=" "
            />
            <span className="highlight"></span>
            <Label htmlFor="inputName">Email</Label>
            {errors.username?.message && (
              <p className="text-red-500">{errors.username?.message}</p>
            )}
          </Group>
          <Group className="form-floating">
            <Control
              id="inputPassword"
              className="form-control"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder=" "
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            <span className="highlight"></span>
            <Label htmlFor="inputPassword">Password</Label>
            {errors.password?.message && (
              <p className="text-red-500">{errors.password?.message}</p>
            )}
          </Group>
          <Button className="form-btn login-btn hover:drop-shadow-xl" variant="link" type="submit">
            {/* Sign In */}
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
