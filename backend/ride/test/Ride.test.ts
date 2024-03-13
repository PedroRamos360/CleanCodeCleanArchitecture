import { Position } from "../src/domain/Position";
import { Ride } from "../src/domain/Ride";

test("Deve testar uma ride", function () {
  const ride = Ride.create({
    fromLat: 0,
    fromLong: 0,
    toLat: 0,
    toLong: 0,
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
  const date = new Date();
  if (date.getHours() >= 8 && date.getHours() <= 22)
    expect(ride.getFare()).toBeCloseTo(21, 0);
  else expect(ride.getFare()).toBeCloseTo(50, 0);
});
