import { Controller, Get, Post, Body, Put, Param, UseInterceptors, UploadedFile,BadRequestException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './lists.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) { }

  @Post()
  create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }
  
  @Post(':listId/import-csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/csv', // folder to save uploaded files
        filename: (req, file, cb) => {
          const randomName = Date.now() + extname(file.originalname);
          cb(null, randomName);
        },
      }),
    }),
  )
  async importCsv(@Param('listId') listId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.listService.importCsv(listId, file.path);
  }

  @Get()
  findAll() {
    return this.listService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(id, updateListDto);
  }

  @Post(':listId/segment')
  async segmentSubscribers(
    @Param('listId') listId: string,
    @Body() filters: Record<string, any>,
  ) {
    return this.listService.segmentSubscribers(listId, filters);
  }

}