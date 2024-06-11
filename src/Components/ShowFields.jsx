import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const ShowFields = ({ fields, handleFieldChange }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mb={3}
      sx={{
        border: '1px solid #3ABEF9',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" component="h2" sx={{ marginBottom: 2, color: '#333' }}>
        Show Field Data
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <FormControlLabel
              control={
                <Checkbox
                  value={field.value}
                  checked={field.checked}
                  onChange={() => handleFieldChange(field.value)}
                  sx={{ color: '#007bff' }}
                />
              }
              label={field.label}
              sx={{ marginBottom: 1 }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ShowFields;
