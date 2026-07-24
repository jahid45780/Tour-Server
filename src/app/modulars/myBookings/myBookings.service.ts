import { Booking } from "../booking/booking.model";

const getMyBookings = async (userId: string) => {
  const result = await Booking.find({ user: userId })
    .populate("tour")
    .sort({ createdAt: -1 });

  return result;
};

export const BookingService = {
  getMyBookings,
};