import { Position } from "../../domain/Position";

export interface PositionRepository {
  save(position: Position): Promise<{ positionId: string }>;
  listPositionsByRideId(rideId: string): Promise<Position[]>;
}
