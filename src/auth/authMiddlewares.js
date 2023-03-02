import passport from 'passport';

function localStrategy(req, res, next) {
  try {
    passport.authenticate(
      'local', { session: false },
      (error, user) => {
        if (error) {
          if (new RegExp("InvalidArgumentError").test(error.message)) {
            return res.status(401).json({ error: error.message });
          }

          if (new RegExp("UnauthorizedUserError").test(error.name)) {
            return res.status(403).json({ error: error.message });
          }

          return res.status(500).json({ error: error.message });
        }
  
        if (!user) {
          return res.status(401).json();
        }
  
        req.user = user;
        return next();
      }
    )(req, res, next);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

function bearerStrategy(req, res, next) {
  try {
    passport.authenticate(
      'bearer', { session: false },
      (error, user, info) => {
        if (error) {
          if (new RegExp("JsonWebTokenError").test(error.name) || new RegExp("TokenExpiredError").test(error.name)) {
            return res.status(401).json({ error: error.message });
          }

          if (new RegExp("InvalidArgumentError").test(error.message)) {
            return res.status(401).json({ error: error.message });
          }

          if (new RegExp("UnauthorizedUserError").test(error.name)) {
            return res.status(403).json({ error: error.message });
          }

          return res.status(500).json({ error: error.message });
        }
  
        if (!user) {
          return res.status(401).json();
        }
  
        req.user = user;
        req.token = info.token;

        return next();
      }
    )(req, res, next);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

export { localStrategy, bearerStrategy };