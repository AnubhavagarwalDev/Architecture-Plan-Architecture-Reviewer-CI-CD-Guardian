import madge from 'madge';
import { getSession, isNeo4jAvailable } from '../db/neo4j';
import path from 'path';

export class GraphParser {
  /**
   * Generates a dependency graph of the codebase and saves it to Neo4j
   */
  static async parseAndSaveGraph(repoFullName: string, dirPath: string) {
    console.log(`Parsing dependencies in ${dirPath}...`);
    const res = await madge(dirPath, {
      fileExtensions: ['js', 'jsx', 'ts', 'tsx'],
      baseDir: dirPath,
      excludeRegExp: [/node_modules/, /dist/, /build/]
    });

    const dependencies = res.obj();
    
    // Save to Neo4j if available
    const session = getSession();
    if (!session) {
      console.warn('[GraphParser] Neo4j unavailable. Skipping graph save.');
      return;
    }

    try {
      // Clear old graph for this repo
      await session.run(`MATCH (n:File {repo: $repo}) DETACH DELETE n`, { repo: repoFullName });

      // Create nodes and edges
      for (const [file, deps] of Object.entries(dependencies)) {
        await session.run(
          `MERGE (n:File {path: $file, repo: $repo})`,
          { file, repo: repoFullName }
        );

        for (const dep of (deps as string[])) {
          await session.run(
            `
            MERGE (a:File {path: $file, repo: $repo})
            MERGE (b:File {path: $dep, repo: $repo})
            MERGE (a)-[:DEPENDS_ON]->(b)
            `,
            { file, dep, repo: repoFullName }
          );
        }
      }
      console.log(`Saved dependency graph for ${repoFullName} to Neo4j`);
    } finally {
      await session.close();
    }
  }

  /**
   * Traverse graph from changed files up to N hops to find dependents
   */
  static async getAffectedSubgraph(repoFullName: string, changedFiles: string[], hops: number = 2): Promise<string[]> {
    const session = getSession();
    if (!session) {
      console.warn('[GraphParser] Neo4j unavailable. Returning changed files only.');
      return changedFiles;
    }

    try {
      const result = await session.run(
        `
        MATCH (a:File {repo: $repo})
        WHERE a.path IN $changedFiles
        MATCH (a)<-[:DEPENDS_ON*1..${hops}]-(b:File {repo: $repo})
        RETURN DISTINCT b.path as affectedPath
        `,
        { repo: repoFullName, changedFiles }
      );
      
      const affectedFiles = result.records.map(record => record.get('affectedPath'));
      // include original changed files
      return [...new Set([...changedFiles, ...affectedFiles])];
    } finally {
      await session.close();
    }
  }
}
