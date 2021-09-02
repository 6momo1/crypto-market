
export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  else {
    res.status(401).send("please Login first.")
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