import neo4j, { Driver } from 'neo4j-driver';

const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

let driver: Driver | null = null;
let isNeo4jAvailable = false;

try {
  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  
  // Test connection asynchronously
  driver.verifyConnectivity()
    .then(() => {
      isNeo4jAvailable = true;
      console.log('Connected to Neo4j');
    })
    .catch((err) => {
      console.warn(`[Neo4j] Could not connect: ${err.message}. Graph features disabled.`);
      isNeo4jAvailable = false;
    });
} catch (err: any) {
  console.warn(`[Neo4j] Failed to initialize driver: ${err.message}`);
}

export { driver, isNeo4jAvailable };

export const getSession = () => {
  if (!driver || !isNeo4jAvailable) {
    return null;
  }
  return driver.session();
};

export const closeNeo4j = async () => {
  if (driver) {
    await driver.close();
  }
};
