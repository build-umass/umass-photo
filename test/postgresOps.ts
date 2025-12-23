import postgres from 'postgres'
import fs from 'fs/promises';

interface DbOperationResult {
    success: boolean;
    error?: string;
}

/**
 * Drops all tables in the public schema of the database
 * @param connectionString - PostgreSQL connection string
 * @returns Result object with success status and optional error message
 */
export async function deleteAllTables(connectionString: string): Promise<DbOperationResult> {
    const sql = postgres(connectionString)

    try {
        const tableMetadata = await sql`
            SELECT * FROM information_schema.tables WHERE table_schema='public';
        `;

        for (const tableMetadataRow of tableMetadata) {
            const tableName = tableMetadataRow.table_name;
            await sql`
                DROP TABLE IF EXISTS ${sql(tableName)} CASCADE;
            `;
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    } finally {
        await sql.end();
    }
}

/**
 * Executes a SQL file against the database
 * @param connectionString - PostgreSQL connection string
 * @param filePath - Absolute path to the SQL file to execute
 * @returns Result object with success status and optional error message
 */
export async function runQueryFile(connectionString: string, filePath: string): Promise<DbOperationResult> {
    const sql = postgres(connectionString)

    try {
        const query = await fs.readFile(filePath, 'utf-8');
        await sql.unsafe(query);
        await sql.end();
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    } finally {
        await sql.end();
    }
}