export interface RequestRideInput {
  passengerId: string;
  from: {
    lat: number;
    lng: number;
  };
  to: {
    lat: number;
    lng: number;
  };
}

export interface RideRepository {
  requestRide(ride: RequestRideInput): Promise<{ rideId: string }>;
  acceptRide(rideId: string, driverId: string): Promise<void>;
  finishRide(rideId: string): Promise<any>;
  getById(rideId: string): Promise<any>;
  startRide(rideId: string): Promise<void>;
  updatePosition(rideId: string, lat: number, long: number): Promise<void>;
}
