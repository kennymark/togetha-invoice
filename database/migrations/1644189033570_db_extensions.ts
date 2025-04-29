import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	public async up() {
		this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

		//enables for better text indexing and allows for similarity func
		//    SELECT * FROM artists
		//    WHERE SIMILARITY(name,'Claud Monay') > 0.4 ;
		// visit https://www.freecodecamp.org/news/fuzzy-string-matching-with-postgresql/
		this.schema.raw("CREATE EXTENSION IF NOT EXISTS  pg_trgm;");

		// enables for geospatial queries
		// this.schema.raw('CREATE EXTENSION postgis;')

		// to generate short ids
		this.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

		// enhances fuzzy matching
		/**
    SELECT * FROM artists
    WHERE nationality IN ('American', 'British')
    AND SOUNDEX(name) = SOUNDEX('Damian Hurst');
    */
		this.schema.raw("CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;");

		this.schema.raw(`CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 12, alphabet text DEFAULT '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
            RETURNS text
            LANGUAGE plpgsql volatile
        AS
        $$
        DECLARE
            idBuilder     text := '';
            i             int  := 0;
            bytes         bytea;
            alphabetIndex int;
            mask          int;
            step          int;
        BEGIN
            mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
            step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

            while true
                loop
                    bytes := gen_random_bytes(size);
                    while i < size
                        loop
                            alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                            if alphabetIndex <= length(alphabet) then
                                idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                                if length(idBuilder) = size then
                                    return idBuilder;
                                end if;
                            end if;
                            i = i + 1;
                        end loop;

                    i := 0;
                end loop;
            END
        $$;`);
	}

	public async down() {
		this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
		this.schema.raw("DROP EXTENSION IF EXISTS pg_trgm;");
		this.schema.raw("DROP EXTENSION IF EXISTS fuzzystrmatch;");
	}
}
