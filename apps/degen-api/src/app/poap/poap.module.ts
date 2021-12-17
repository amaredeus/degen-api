import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { PoapController } from './poap.controller';
import { PoapAdminDTO } from './models/poap-admin.model';
import { PoapService } from './poap.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PoapAdminDTO,
        schemaOptions: {
          collection: 'poapAdmins',
        },
      },
    ]),
  ],
  controllers: [PoapController],
  providers: [PoapService],
})
export class PoapModule {}
