import postgres from 'postgres'
import fs from 'fs/promises';

type DbOperationResult = {
    success: true;
    error: null;
} | {
    success: false;
    error: string;
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
        return { success: true, error: null };
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
    const query = await fs.readFile(filePath, 'utf-8');
    const sql = postgres(connectionString)

    try {
        await sql.unsafe(query);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    } finally {
        await sql.end();
    }
}

export async function reloadSchema(connectionString: string): Promise<DbOperationResult> {
    const sql = postgres(connectionString)

    try {
        await sql`NOTIFY pgrst, 'reload schema';`;
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    } finally {
        await sql.end();
    }

    // wait for the reload notification to be processed
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, error: null };
}
