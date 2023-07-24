import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import { InputBookingBody } from '@/protocols';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBookingByUserId(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as InputBookingBody;
  try {
    const booking = await bookingService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    if (err.name === 'ForbiddenError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (err.name === 'RequestError') return res.status(httpStatus.BAD_REQUEST).send(err.message);
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as InputBookingBody;
  try {
    const booking = await bookingService.updateBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    if (err.name === 'ForbiddenError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (err.name === 'RequestError') return res.status(httpStatus.BAD_REQUEST).send(err.message);
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

const bookingController = {
  updateBooking,
  createBooking,
  getBookings,
};

export default bookingController;
