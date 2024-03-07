import axios from "axios";
import {
  RequestRideInput,
  RideRepository,
} from "../../application/repository/RideRepository";
import { getEnviormentVariable } from "../../env/getEnvironmentVariable";

export class RideRepositoryApi implements RideRepository {
  async startRide(rideId: string): Promise<void> {
    await axios.post(
      `http://localhost:${getEnviormentVariable("RIDE_PORT")}/start-ride`,
      { rideId }
    );
  }
  async updatePosition(
    rideId: string,
    lat: number,
    long: number
  ): Promise<void> {
    await axios.post(
      `http://localhost:${getEnviormentVariable("RIDE_PORT")}/update-position`,
      { rideId, lat, long }
    );
  }
  async requestRide(ride: RequestRideInput): Promise<{ rideId: string }> {
    const { data } = await axios.post(
      `http://localhost:${getEnviormentVariable("RIDE_PORT")}/request-ride`,
      ride
    );
    return data;
  }
  async acceptRide(rideId: string, driverId: string): Promise<void> {
    await axios.post(
      `http://localhost:${getEnviormentVariable("RIDE_PORT")}/accept-ride`,
      { rideId, driverId }
    );
  }
  async finishRide(rideId: string): Promise<any> {
    const { data } = await axios.post(
      `http://localhost:${getEnviormentVariable("RIDE_PORT")}/finish-ride`,
      { rideId }
    );
    return data;
  }
  async getById(rideId: string): Promise<any> {
    const { data } = await axios.get(
      `http://localhost:${getEnviormentVariable("RIDE_PORT")}/rides/${rideId}`
    );
    return data;
  }
}
