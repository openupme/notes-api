import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event) => {
  const { limit, offset } = event.arguments;

  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    KeyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ":userId": "123",
    },
    ExclusiveStartKey: offset && parseNextToken(offset),
    Limit: limit || 15,
  };

  const res = await dynamoDb.query(params);

  return {
    notes: res.Items,
    nextToken: genNextToken(res.LastEvaluatedKey)
  };

  // // Return the matching list of items in response body
  // return result.Items;
});

function parseNextToken(nextToken) {
  if (!nextToken) {
    return undefined;
  }

  const token = Buffer.from(nextToken, 'base64').toString();
  const searchParams = JSON.parse(token);

  return searchParams;
}

function genNextToken(rawToken) {
  if (!rawToken) {
    return null;
  }

  const token = JSON.stringify(rawToken);
  return Buffer.from(token).toString('base64');
}
