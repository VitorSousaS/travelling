import { Suspense, lazy } from "react";
import { Loading } from "../components";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoggedRoute } from "./LoggedRoute";
import { PrivateRoute } from "./PrivateRoute";
import {
  AgencyProvider,
  BusinessProvider,
  FiltersProvider,
  LocalProvider,
  TravellingProvider,
} from "../context";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Tourist = lazy(() => import("../pages/Tourist"));
const Agency = lazy(() => import("../pages/Agency"));
const Business = lazy(() => import("../pages/Business"));
const Details = lazy(() => import("../pages/Details"));
const Contracts = lazy(() => import("../pages/Contracts"));
const Travellings = lazy(() => import("../pages/Travellings"));

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="login"
        element={
          <Suspense fallback={<Loading />}>
            <LoggedRoute>
              <Login />
            </LoggedRoute>
          </Suspense>
        }
      />
      <Route
        path="register"
        element={
          <Suspense fallback={<Loading />}>
            <LoggedRoute>
              <Register />
            </LoggedRoute>
          </Suspense>
        }
      />
      <Route
        path="tourist"
        element={
          <Suspense fallback={<Loading />}>
            <FiltersProvider>
              <TravellingProvider>
                <Tourist />
              </TravellingProvider>
            </FiltersProvider>
          </Suspense>
        }
      />
      <Route
        path="agency"
        element={
          <Suspense fallback={<Loading />}>
            <PrivateRoute>
              <LocalProvider>
                <AgencyProvider>
                  <Agency />
                </AgencyProvider>
              </LocalProvider>
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="business"
        element={
          <Suspense fallback={<Loading />}>
            <PrivateRoute>
              <LocalProvider>
                <BusinessProvider>
                  <Business />
                </BusinessProvider>
              </LocalProvider>
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="details"
        element={
          <Suspense fallback={<Loading />}>
            <Details />
          </Suspense>
        }
      />
      <Route
        path="contracts"
        element={
          <Suspense fallback={<Loading />}>
            <PrivateRoute>
              <Contracts />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="travellings"
        element={
          <Suspense fallback={<Loading />}>
            <PrivateRoute>
              <TravellingProvider>
                <Travellings />
              </TravellingProvider>
            </PrivateRoute>
          </Suspense>
        }
      />
    </Routes>
  );
}
