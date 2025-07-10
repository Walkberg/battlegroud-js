import { Module } from '@nestjs/common';
import { GameGateway } from './battleground/game.gateway';
import { BattlegroundService } from './battleground/battleground.service';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { MatchmakingGateway } from './matchmaking/matchmaking.gateway';
import { MatchmakingRepositoryImpl } from './matchmaking/matchmaking.repository';
import { MatchmakingRepository } from './matchmaking/matchmaking';

@Module({
  imports: [],
  controllers: [],
  providers: [
    GameGateway,
    BattlegroundService,
    MatchmakingService,
    {
      provide: MatchmakingRepository,
      useClass: MatchmakingRepositoryImpl,
    },
    MatchmakingGateway,
  ],
})
export class AppModule {}
