import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CheckLogs = ({ items, selectedItems, handleChange }) => {
  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              checked={selectedItems.includes(item)}
              onChange={() => handleChange(item)}
              value={item}
            />
          }
          label={item}
        />
      ))}
    </FormGroup>
  );
};

export default CheckLogs;
