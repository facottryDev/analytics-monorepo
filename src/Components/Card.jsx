/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

const Cards = ({ result }) => {
  const renderCardContent = (title, items) => (
    <Card sx={{ maxWidth: 345, mb: 2, backgroundColor: '#007bff', color: '#fff' }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" color="#fff">
            {title}
          </Typography>
          <Typography variant="body2" color="#fff">
            <ul className="list-disc ml-5">
              {Object.entries(items).map(([key, value], index) => (
                <li key={index}>
                  <Typography variant="body2" color="#fff">
                    {`${key} - ${value} `}
                  </Typography>
                </li>
              ))}
            </ul>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {result.countries && Object.keys(result.countries).length > 0 && renderCardContent('Countries', result.countries)}
      {result.subscriptions && Object.keys(result.subscriptions).length > 0 && renderCardContent('Subscriptions', result.subscriptions)}
      {result.os && Object.keys(result.os).length > 0 && renderCardContent('Operating Systems', result.os)}
      {result.osVersions && Object.keys(result.osVersions).length > 0 && renderCardContent('OS Versions', result.osVersions)}
      {result.modelNames && Object.keys(result.modelNames).length > 0 && renderCardContent('Model Names', result.modelNames)}
      {result.plans && Object.keys(result.plans).length > 0 && renderCardContent('Plans', result.plans)}
      {result.states && Object.keys(result.states).length > 0 && renderCardContent('States', result.states)}
    </div>
  );
};

export default Cards;
