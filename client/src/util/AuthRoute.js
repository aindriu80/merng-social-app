import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../context/auth";

function AuthRoute({ component: Component, ...rest }) {
  // Removed the parenthesis around { user } because of TypeError: Object(...)(...) is undefined
  const user = useContext({ AuthContext });

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}
export default AuthRoute;
