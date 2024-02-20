import { PositionRepository } from "../../application/repository/PositionRepository";
import { Position } from "../../domain/Position";
import { DatabaseConnection } from "../database/DatabaseConnection";

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(private connection: DatabaseConnection) {}

  async save(position: Position) {
    await this.connection.query(
      "insert into cccat14.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
      [
        position.positionId,
        position.rideId,
        position.lat,
        position.long,
        position.date,
      ]
    );

    return {
      positionId: position.positionId,
    };
  }

  async listPositionsByRideId(rideId: string) {
    const positions = await this.connection.query(
      "select * from cccat14.position where ride_id = $1",
      [rideId]
    );

    return positions.map((position: any) => {
      return Position.restore(
        position.position_id,
        position.ride_id,
        position.lat,
        position.long,
        position.date
      );
    });
  }
}
