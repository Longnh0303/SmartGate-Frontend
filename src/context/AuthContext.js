// ** React Imports
import { createContext, useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Config
import { logOut, login } from "src/api/auth";
import { getUserById } from "src/api/user";
import jwt_decode from "jwt-decode";
import {
  setAccessToken,
  getAccessToken,
  removeAccessToken,
  setUserData,
  removeUserData,
} from "src/utils/localStorage";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAccessToken();
      if (storedToken) {
        const userId = jwt_decode(storedToken).id;
        setLoading(true);
        await getUserById(userId)
          .then(async (response) => {
            setLoading(false);
            setUser({ ...response });
          })
          .catch(() => {
            removeUserData();
            removeAccessToken();
            setUser(null);
            setLoading(false);
            if (!router.pathname.includes("login")) {
              router.replace("/login");
            }
          });
      } else {
        setLoading(false);
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (params, errorCallback) => {
    const data = {
      email: params.email,
      password: params.password,
    };
    await login(data)
      .then(async (response) => {
        setAccessToken(response.token);
        const returnUrl = router.query.returnUrl;
        setUser({ ...response.user });
        setUserData(JSON.stringify(response.user));
        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
        router.replace(redirectURL);
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = async () => {
    await logOut()
      .then(() => {
        setUser(null);
        removeUserData();
        removeAccessToken();
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
