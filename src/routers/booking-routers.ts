import { Router } from 'express';
import bookingController from '@/controllers/booking-controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.use(authenticateToken);
bookingRouter.get('/', bookingController.getBookings);
bookingRouter.post('/', bookingController.createBooking);
bookingRouter.put('/:bookingId', bookingController.updateBooking);

export default bookingRouter;
