import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000,
  });

  return res.json({ success: true });
};

const me = (req, res) =>
  res.json({ success: true, data: { email: req.admin.email } });

const logout = (req, res) => {
  res.clearCookie("admin_token");
  return res.json({ success: true });
};

export { login, me, logout };
