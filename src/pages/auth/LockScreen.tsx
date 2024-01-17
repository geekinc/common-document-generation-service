import React, {useEffect} from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// actions
import { loginUser } from "../../redux/actions";

// store
import { RootState, AppDispatch } from "../../redux/store";

// components
import { VerticalForm, FormInput } from "../../components/";
import AuthLayout from "./AuthLayout";
import userImg from "../../assets/images/users/user-1.jpg";
import { useDispatch, useSelector } from "react-redux";

interface UserData {
  password: string;
}

/* bottom link */
const BottomLink = () => {
  const { t } = useTranslation();
  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p className="text-white-50">
          {t("Not you? return")}{" "}
          <Link to={"/auth/login"} className="text-white ms-1">
            <b>{t("Sign In")}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

const LockScreen = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const { user, userLoggedIn, loading, error } = useSelector(
        (state: RootState) => ({
            user: state.Auth.user,
            loading: state.Auth.loading,
            error: state.Auth.error,
            userLoggedIn: state.Auth.userLoggedIn,
        })
    );

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object().shape({
      password: yup.string().required(t("Please enter Password")),
    })
  );

  /*
   * handle form submission
   */
  const onSubmit = async (formData: UserData) => {
    await dispatch(loginUser(user.username, formData["password"]));
  };

  return (
      <>


      <AuthLayout bottomLinks={<BottomLink />}>
        <div className="text-center w-75 m-auto">
          <img
            src={userImg}
            alt=""
            height="88"
            className="rounded-circle shadow"
          />
          <h4 className="text-dark-50 text-center mt-3">{t("Hi ! Geneva ")}</h4>
            <p className="text-muted mb-4">
                {t("Enter your password to access the admin.")}
            </p>
        </div>
          <VerticalForm
            onSubmit={onSubmit}
            resolver={schemaResolver}
        >
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder={t("Enter your password")}
            containerClass={"mb-3"}
          />

          <div className="d-grid text-center">
            <Button variant="primary" type="submit">
              {t("Log In")}
            </Button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  );
};

export default LockScreen;
