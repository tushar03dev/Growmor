import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleSignIn: React.FC = () => {
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleGoogleSignIn}
      fullWidth
      sx={{
        mt: 2,
        mb: 2,
        backgroundColor: 'white',
        color: '#757575',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleSignIn;
