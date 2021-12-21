import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { PoapAdminController } from './controllers/poap-admin.controller';
import { PoapAdminDTO } from './models/poap-admin.model';
import { PoapAdminService } from './services/poap-admin.service';

@Module({
  imports: [TypegooseModule.forFeature([PoapAdminDTO])],
  controllers: [PoapAdminController],
  providers: [PoapAdminService],
})
export class PoapModule {}
