import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/typeorm.module'; // ajuste o caminho se precisar
// importe outros módulos, controllers, services aqui

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    // outros módulos aqui
  ],
  controllers: [
    // seus controllers aqui
  ],
  providers: [
    // seus serviços aqui
  ],
})
export class AppModule {}
