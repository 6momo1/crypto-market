
export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  else {
    res.status(401).send("please Login first.")
  }
}

export const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.googleId == process.env.ADMIN_GOOGLE_ID1) {
    return next()
  }
  else {
    res.status(401).send("Not Admin.")
  }
}

export const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  }
  else {
    res.status(401)
  }
}