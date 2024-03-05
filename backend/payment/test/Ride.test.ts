import { Position } from "../src/domain/Position";
import { Ride } from "../src/domain/Ride";

test("Deve testar uma ride", function () {
  const ride = Ride.create({
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
    passengerId: "",
  });
  ride.accept("");
  ride.start();
  const position1 = new Position("", {
    lat: -27.584905257808835,
    long: -48.545022195325124,
  });
  ride.updatePosition(position1);
  const position2 = new Position("", {
    lat: -27.496887588317275,
    long: -48.522234807851476,
  });
  ride.updatePosition(position2);
  ride.finish();
  expect(ride.getDistance()).toBeCloseTo(10, 0);
  expect(ride.getFare()).toBeCloseTo(21, 0);
});
