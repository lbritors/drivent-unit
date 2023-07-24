import { notFoundError, requestError } from '@/errors';
import { forbiddenError } from '@/errors/fobidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBookingByUserId(userId: number) {
  const booking = await bookingRepository.getBookingByUserId(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function createBooking(userId: number, roomId: number) {
  if (roomId < 0) throw requestError(400, 'Bad Request');
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === 'RESERVED') {
    throw forbiddenError();
  }
  const room = await bookingRepository.decrementRoomCapacity(roomId);
  if (!room.id) throw notFoundError();
  if (room.capacity === 0) throw forbiddenError();
  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking.id;
}

async function updateBooking(userId: number, roomId: number) {
  if (roomId < 0) throw requestError(400, 'Bad Request');
  const booking = await bookingRepository.getBookingByUserId(userId);
  if (!booking || booking === null) throw forbiddenError();
  const count = await bookingRepository.countCapacity(roomId);
  if (!count || count === null || count.capacity === 0) throw forbiddenError();
  if (!count.id) throw notFoundError();
  const updateFormerRoom = await bookingRepository.incrementRoomCapacity(booking.Room.id);
  const updateNewRoom = await bookingRepository.decrementRoomCapacity(count.id);
  const newBooking = await bookingRepository.updateBooking(booking.id, updateNewRoom.id);
  return newBooking.id;
}

const bookingService = {
  getBookingByUserId,
  createBooking,
  updateBooking,
};

export default bookingService;
