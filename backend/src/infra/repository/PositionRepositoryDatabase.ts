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
}
