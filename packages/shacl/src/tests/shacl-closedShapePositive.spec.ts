import * as Support from "./support/testSupport";
import ClosedShapeModelCreator from "./support/ClosedShapeModelCreator";

/*
test('Test SHACL against data - closed shape POSITIVE ', async () => {

  await Support.prepareShape(new ClosedShapeModelCreator(), '../shapes/closedShape.ttl');
  const validation = await Support.validateDataAgainstShape('src/tests/data/closedShapePositive-data.ttl', 'src/tests/shapes/closedShapePositive.ttl');
  expect(validation).toBe(true);

});
*/

test('Shape conforms to SHACL standard - closed shape ', async () => {

  await Support.prepareShape(new ClosedShapeModelCreator(), '../shapes/closedShape.ttl');
  const validation = await Support.validateDataAgainstShape("src/tests/shapes/closedShapePositive.ttl", "src/tests/shapes/shapeToValidateShapes.ttl");
  expect(validation).toBe(true);

});
