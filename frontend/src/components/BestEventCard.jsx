import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material'

const BestEventCard = ({ event }) => {

    return (
        <Card className='mx-8 mt-10 rounded-4xl' sx={{ width: 250, height: 250 }}>
            <CardMedia
                sx={{ height: 150, width: 250 }}
                image={event.image}
                title={event.title}
                className='object-contain'
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {event.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {event.desc}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default BestEventCard;