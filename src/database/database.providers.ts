// database/database.providers.ts
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const logger = new Logger('DatabaseProviders');
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        // logging: true,
      });
      try {
        await dataSource.initialize();
        logger.log('DB connected successfully');
      } catch (error) {
        logger.error('Error connecting to the database', error); // Log errors
        throw error;
      }
      return dataSource;
    },
  },
];
