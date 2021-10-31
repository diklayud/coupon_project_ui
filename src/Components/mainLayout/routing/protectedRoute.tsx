import { Redirect, Route, RouteProps, Switch } from "react-router-dom";
import "./routing.css";


export type ProtectedRouteProps = {
  isAuthenticated: boolean;
} & RouteProps;

export default function ProtectedRoute({ isAuthenticated, ...routeProps }: ProtectedRouteProps) {
  if (isAuthenticated) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: '/login' }} />;
  }
};