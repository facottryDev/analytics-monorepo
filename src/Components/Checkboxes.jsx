import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Checkboxes = ({ label, options, selectedOptions, handleChange }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      mb={3}
      sx={{
        border: '1px solid #3ABEF9',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" component="h2" sx={{ marginRight: 3, alignSelf: 'center', color: '#333' }}>
        {label}
      </Typography>
      <FormGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                value={option}
                checked={selectedOptions.some(selected => selected.value === option)}
                onChange={handleChange}
                sx={{ color: '#007bff' }}
              />
            }
            label={option}
            sx={{ marginBottom: 1 }}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default Checkboxes;
