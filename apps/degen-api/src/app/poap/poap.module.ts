import { PoapEventService } from './services/poap-event.service';
import { PoapEventController } from './controllers/poap-event.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { PoapAdminController } from './controllers/poap-admin.controller';
import { PoapAdminModel } from './models/poap-admin.model';
import { PoapAdminService } from './services/poap-admin.service';
import { PoapParticipantsModel } from './models/poap-participants.model';
import { PoapSettingsModel } from './models/poap-settings.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      PoapAdminModel,
      PoapSettingsModel,
      PoapParticipantsModel,
    ]),
  ],
  controllers: [PoapAdminController, PoapEventController],
  providers: [PoapAdminService, PoapEventService],
})
export class PoapModule {}
