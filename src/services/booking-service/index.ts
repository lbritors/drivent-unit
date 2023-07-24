import { notFoundError, requestError } from '@/errors';
import { forbiddenError } from '@/errors/fobidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBookingByUserId(userId: number) {
  const booking = await bookingRepository.getBookingByUserId(userId);
  if (!booking) throw notFoundError();
  const response = {
    id: booking.id,
    Room: {
      id: booking.Room.id,
      name: booking.Room.name,
      capacity: booking.Room.capacity,
      hotelId: booking.Room.hotelId,
      createdAt: booking.Room.createdAt,
      updatedAt: booking.Room.updatedAt,
    },
  };
  return response;
}

async function createBooking(userId: number, roomId: number) {
  if (roomId < 0 || roomId === null) throw requestError(400, 'Bad Request');
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === 'RESERVED') {
    throw forbiddenError();
  }
  const room = await bookingRepository.getRoom(roomId);
  if (!room) throw notFoundError();
  if (room.capacity === 0) throw forbiddenError();
  const booking = await bookingRepository.createBooking(userId, roomId);
  await bookingRepository.decrementRoomCapacity(roomId);
  const response = {
    id: booking.id,
  };
  return response;
}

async function updateBooking(userId: number, roomId: number) {
  if (roomId < 0 || roomId === null) throw requestError(400, 'Bad Request');
  const booking = await bookingRepository.getBookingByUserId(userId);
  if (!booking || booking === null) throw forbiddenError();
  const room = await bookingRepository.getRoom(roomId);
  if (!room) throw notFoundError();
  if (room.capacity === 0) throw forbiddenError();
  await bookingRepository.incrementRoomCapacity(booking.Room.id);
  const updateNewRoom = await bookingRepository.decrementRoomCapacity(room.id);
  await bookingRepository.updateBooking(booking.id, updateNewRoom.id);
  const response = {
    id: booking.id,
  };
  return response;
}

const bookingService = {
  getBookingByUserId,
  createBooking,
  updateBooking,
};

export default bookingService;
