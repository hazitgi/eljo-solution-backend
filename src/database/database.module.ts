import { Global, Logger, Module } from '@nestjs/common';
import { Database } from './database';
import { databaseProviders } from './database.providers';
import { DataSource } from 'typeorm';

@Global()
@Module({
  imports: [],

  providers: [
    {
      provide: DataSource, // add the datasource as a provider
      inject: [],
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
          synchronize: true,
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
  ],
  exports: [DataSource],
})
export class DatabaseModule {}
