import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Form } from "react-bootstrap";
import axios from "axios";

import { API_URL } from "../../Api";

function SignIn() {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response = await axios.post(
            `${API_URL}/login`,
            {
              email: values.email,
              password: values.password,
            }
          );

          // Store the token in local storage or state
          localStorage.setItem("token", response.data.token);

          // Redirect to private route
          navigate("/dashboard/default");
        } catch (error) {
          const message = error.response.data.error || "Something went wrong";

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Alert className="my-3" variant="primary">
            {/* <div className="alert-message">
              Use <strong>demo@bootlab.io</strong> and{" "}
              <strong>unsafepassword</strong> to sign in
            </div> */}
          </Alert>
          {errors.submit && (
            <Alert className="my-3" variant="danger">
              <div className="alert-message">{errors.submit}</div>
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              size="lg"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              isInvalid={Boolean(touched.email && errors.email)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {!!touched.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              isInvalid={Boolean(touched.password && errors.password)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {!!touched.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            )}
            <small>
              {/* <Link to="/auth/reset-password">Forgot password?</Link> */}
            </small>
          </Form.Group>

          {/* <div>
            <Form.Check
            // type="checkbox"
            // id="rememberMe"
            // label="Remember me next time"
            // defaultChecked
            />
          </div> */}

          <div className="text-center mt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
            >
              Sign in
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SignIn;
