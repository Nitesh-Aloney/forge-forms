import { Box, Typography } from '@mui/material';

export default function Error403() {
  return (
    <Box
      data-test="error-403-page"
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'primary.dark',
            fontSize: '6rem',
            fontWeight: 'bold',
            mb: 4,
          }}
          variant="h1"
        >
          UNAUTHORIZED
        </Typography>
        <Typography
          sx={{
            color: 'primary.dark',
            fontSize: '2.25rem',
            fontWeight: 600,
            mb: 8,
          }}
          variant="h2"
        >
          Unauthorized access, verify the token or please contact system administrator to resolve access issue
        </Typography>
        <Box alt="error 403 image" component="img" height={500} src="/images/403.svg" width={500} />
      </Box>
    </Box>
  );
}
