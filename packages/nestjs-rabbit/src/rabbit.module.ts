import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { RabbitMetadataAccessor } from './rabbit-metadata.accessor';
import { ASYNC_MODULE_OPTIONS } from './rabbit.constants';
import { RabbitOptions } from './rabbit.interfaces';
import { RabbitOrchestrator } from './rabbit.orchestrator';
import { RabbitService } from './rabbit.service';

interface RabbitAsyncModuleOptions {
  imports?: any[];
  injects?: any[];
  useFactory: (...args: any[]) => RabbitOptions | Promise<RabbitOptions>;
}

@Module({})
export class RabbitModule {
  public static forRoot(options: RabbitOptions): DynamicModule {
    return {
      global: true,
      module: RabbitModule,
      imports: [DiscoveryModule],
      providers: [
        RabbitMetadataAccessor,
        RabbitOrchestrator,
        {
          provide: RabbitService,
          useValue: new RabbitService(options),
        },
      ],
      exports: [RabbitService],
    };
  }

  public static forRootAsync(options: RabbitAsyncModuleOptions): DynamicModule {
    return {
      global: true,
      module: RabbitModule,
      imports: [DiscoveryModule, ...(options.imports ?? [])],
      providers: [
        {
          provide: ASYNC_MODULE_OPTIONS,
          inject: options.injects,
          useFactory: options.useFactory,
        },
        {
          provide: RabbitService,
          inject: [ASYNC_MODULE_OPTIONS],
          useFactory: (opts: RabbitOptions) => {
            return new RabbitService(opts);
          },
        },
        RabbitMetadataAccessor,
        RabbitOrchestrator,
      ],
      exports: [RabbitService],
    };
  }
}
