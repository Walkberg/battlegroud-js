import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './battleground/game.gateway';
import { BattlegroundService } from './battleground/battleground.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GameGateway, BattlegroundService],
})
export class AppModule {}
