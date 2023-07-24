import { prisma } from '@/config';

async function getBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    include: {
      Room: true,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

async function decrementRoomCapacity(roomId: number) {
  return prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      capacity: {
        decrement: 1,
      },
    },
  });
}
async function incrementRoomCapacity(roomId: number) {
  return prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      capacity: {
        increment: 1,
      },
    },
  });
}

async function countCapacity(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
      capacity: {
        gt: 0,
      },
    },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: roomId,
    },
  });
}

async function getRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}
const bookingRepository = {
  getBookingByUserId,
  createBooking,
  decrementRoomCapacity,
  countCapacity,
  incrementRoomCapacity,
  updateBooking,
  getRoom,
};

export default bookingRepository;
