export const saveAuthSession = (response) => {
  if (response?.token) {
    localStorage.setItem("token", response.token);
  }

  if (response?.user) {
    localStorage.setItem("user", JSON.stringify(response.user));
  }

  window.dispatchEvent(new Event("devpath_auth_change"));
};

export const redirectAfterAuth = (navigate, user) => {
  if (!user) {
    navigate("/");
    return;
  }

  if (user.role === "admin") {
    navigate("/admin");
    return;
  }

  if (user.role === "enterprise" || user.role === "employer") {
    navigate("/employer");
    return;
  }

  navigate("/");
};
