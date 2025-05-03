import { type RouteRecordRaw } from "vue-router";

import SignIn from "@/pages/auth/SignInPage.vue";
import Signup from "@/pages/auth/SignUpPage.vue";
import VerifyEmail from "@/pages/auth/VerifyEmailPage.vue";
import RequestEmailVerif from "@/pages/auth/RequestVerifPage.vue";
import ResetPassword from "@/pages/auth/ResetPasswordPage.vue";
import ForgotPassWord from "@/pages/auth/ForgotPasswordPage.vue";
import UsersPage from "@/pages/auth/UsersPage.vue";
import UserProfile from "@/pages/auth/UserProfile.vue";

const routes: RouteRecordRaw[] = [
  { path: "/sign-in", component: SignIn, name: "SignIn" },
  { path: "/sign-up", component: Signup, name: "SignUp" },
  { path: "/verify-email", component: VerifyEmail, name: "VerifyEmail" },
  {
    path: "/forgot-password",
    component: ForgotPassWord,
    name: "ForgotPassword",
  },
  {
    path: "/reset-password",
    component: ResetPassword,
    name: "ResetPassword",
  },
  {
    path: "/request-verification-email",
    component: RequestEmailVerif,
    name: "RequestVerifyEmail",
  },
  {
    path: "/admin/users",
    component: UsersPage,
    name: "AdminUsers",
  },
  {
    path: "/admin/user-profile/:id",
    component: UserProfile,
    name: "UserProfile",
  },
];

export default routes;
