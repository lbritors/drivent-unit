/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from '@faker-js/faker';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingService from '@/services/booking-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it('should return NotFoundError when booking is not found', async () => {
    const userId = faker.datatype.number();
    const spy = jest.spyOn(bookingRepository, 'getBookingByUserId');
    spy.mockResolvedValueOnce(null);
    const promise = bookingService.getBookingByUserId(userId);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('POST /booking', () => {
  it('should return 404 when room doesnt exist', async () => {
    const enrollment = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollment.mockImplementationOnce((): any => {
      return 1;
    });
    const ticket = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticket.mockImplementationOnce((): any => {
      return {
        TicketType: {
          id: 1,
          name: '101',
          price: 99,
          isRemote: false,
          includesHotel: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: 'PAID',
      };
    });
    const room = jest.spyOn(bookingRepository, 'getRoom');
    room.mockResolvedValueOnce(null);
    const userId = faker.datatype.number();
    const roomId = faker.datatype.number();
    const promise = bookingService.createBooking(userId, roomId);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
  it('Should return ForbiddenError if there are no rooms available', async () => {
    const enrollment = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollment.mockImplementationOnce((): any => {
      return 1;
    });
    const ticket = jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId');
    ticket.mockImplementationOnce((): any => {
      return {
        TicketType: {
          id: 1,
          name: '101',
          price: 99,
          isRemote: true,
          includesHotel: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    });
    const room = jest.spyOn(bookingRepository, 'getRoom');
    room.mockImplementationOnce((): any => {
      return {
        capacity: 0,
      };
    });
    jest.spyOn(bookingRepository, 'createBooking');
    const userId = faker.datatype.number();
    const roomId = faker.datatype.number();
    const promise = bookingService.createBooking(userId, roomId);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Access Forbidden',
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('Should return 403 if user has no booking beforehand', async () => {
    const booking = jest.spyOn(bookingRepository, 'getBookingByUserId');
    booking.mockResolvedValueOnce(null);
    const room = jest.spyOn(bookingRepository, 'getRoom');
    room.mockImplementationOnce((): any => {
      return 1;
    });
    const userId = faker.datatype.number();
    const roomId = faker.datatype.number();
    const promise = bookingService.updateBooking(userId, roomId);
    expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Access Forbidden',
    });
  });
});
