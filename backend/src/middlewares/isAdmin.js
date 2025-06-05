//middleware/isAdmin
const isAdmin = (req, res, next) => {

  console.log('🔐 isAdmin check:', req.user); 

    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
      
      
    }
    next();
  };
  
  module.exports = isAdmin;