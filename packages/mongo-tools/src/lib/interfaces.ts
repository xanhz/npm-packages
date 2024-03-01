export interface CommonOptions {
  quiet?: boolean;
  config?: string;
  uri?: string;
  host?: string;
  port?: number;
  sslCAFile?: string;
  sslPEMKeyFile?: string;
  sslPEMKeyPassword?: string;
  sslCRLFile?: string;
  sslAllowInvalidCertificates?: boolean;
  sslAllowInvalidHostnames?: boolean;
  username?: string;
  password?: string;
  awsSessionToken?: string;
  authenticationDatabase?: string;
  authenticationMechanism?: string;
  gssapiServiceName?: string;
  gssapiHostName?: string;
  db?: string;
}

export type ReadPreference = 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest';

export interface DumpOptions extends CommonOptions {
  collection?: string;
  query?: Record<string, any>;
  queryFile?: string;
  readPreference?: ReadPreference;
  gzip?: boolean;
  out?: string;
  archive?: string;
  oplog?: boolean;
  dumpDbUsersAndRoles?: boolean;
  excludeCollection?: string | string[];
  excludeCollectionsWithPrefix?: string | string[];
  numParallelCollections?: number;
  viewsAsCollections?: boolean;
}

export interface RestoreOptions extends CommonOptions {
  collection?: string;
  nsExclude?: string | string[];
  nsInclude?: string | string[];
  nsFrom?: string;
  nsTo?: string;
  objcheck?: boolean;
  drop?: boolean;
  preserveUUID?: boolean;
  dryRun?: boolean;
  oplogReplay?: boolean;
  oplogLimit?: number;
  oplogFile?: string;
  convertLegacyIndexes?: boolean;
  keepIndexVersion?: boolean;
  noIndexRestore?: boolean;
  noOptionsRestore?: boolean;
  restoreDbUsersAndRoles?: boolean;
  writeConcern?: object;
  maintainInsertionOrder?: boolean;
  numParallelCollections?: number;
  numInsertionWorkersPerCollection?: number;
  stopOnError?: boolean;
  bypassDocumentValidation?: boolean;
  gzip?: boolean;
  archive?: string;
  dir?: string;
}

export interface ImportOptions extends CommonOptions {
  collection?: string;
  fields?: string[];
  fieldFile?: string;
  ignoreBlanks?: boolean;
  type?: 'json' | 'csv' | 'tsv';
  file?: string;
  drop?: boolean;
  headerline?: boolean;
  useArrayIndexFields?: boolean;
  mode?: 'insert' | 'upsert' | 'merge' | 'delete';
  upsertFields?: string[];
  stopOnError?: boolean;
  jsonArray?: boolean;
  legacy?: boolean;
  maintainInsertionOrder?: boolean;
  numInsertionWorkers?: number;
  writeConcern?: object;
  bypassDocumentValidation?: boolean;
  columnsHaveTypes?: boolean;
  parseGrace?: 'autoCast' | 'skipField' | 'skipRow' | 'stop';
}

export interface ExportOptions extends CommonOptions {
  collection?: string;
  fields?: string[];
  fieldFile?: string;
  query?: Record<string, any>;
  queryFile?: string;
  type?: 'json' | 'csv';
  out?: string;
  jsonFormat?: 'canonical' | 'relaxed';
  jsonArray?: boolean;
  pretty?: boolean;
  noHeaderLine?: boolean;
  readPreference?: ReadPreference;
  skip?: number;
  limit?: number;
  sort?: Record<string, -1 | 1 | 'asc' | 'desc'>;
}
