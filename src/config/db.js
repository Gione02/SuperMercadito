let sql = require('mssql');

const dbServer = process.env.DB_SERVER || 'localhost';
const dbName = process.env.DB_NAME || 'SuperMercaditoDB';
const authMode = (process.env.DB_AUTH_MODE || 'sql').toLowerCase();
const useWindowsAuth = authMode === 'windows';
const [dbHost, dbInstanceName] = dbServer.split('\\');

if (useWindowsAuth) {
  try {
    sql = require('mssql/msnodesqlv8');
  } catch (err) {
    console.error(
      "Falta dependencia para autenticacion de Windows. Ejecuta: npm install msnodesqlv8"
    );
    process.exit(1);
  }
}

const config = useWindowsAuth
  ? {
      connectionString: `Driver={ODBC Driver 18 for SQL Server};Server=${dbServer};Database=${dbName};Trusted_Connection=Yes;Encrypt=No;TrustServerCertificate=Yes;`,
      server: dbHost,
      database: dbName,
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
        ...(dbInstanceName ? { instanceName: dbInstanceName } : {})
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: dbServer,
      database: dbName,
      options: {
        encrypt: false, // true si usas Azure
        trustServerCertificate: true
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    };

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado a SQL Server - SuperMercaditoDB');
    return pool;
  })
  .catch(err => {
    const detail =
      err && err.message
        ? err.message
        : typeof err === 'object'
          ? JSON.stringify(err)
          : String(err);
    console.error('Error de conexión a SQL Server:', detail);
    console.error('Detalle técnico SQL Server:', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };
