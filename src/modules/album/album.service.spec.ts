import { Test, TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumDto } from './dto/album.dto';
import { FileDto } from '../file/dto/file.dto';
import { Role } from '../../common/enums/enum';
import { ServiceResult } from '../../helpers/response/result';

const mockAlbum: AlbumDto = {
  id: '123456',
  title: 'Test album',
  pka: 'PKA test',
  songs: [],
  cover: new FileDto(),
  created_at: new Date(),
  updated_at: new Date(),
  created_by_id: '123',
  updated_by_id: '123',
};

const mockAlbums: AlbumDto[] = [mockAlbum];

const roles: Role[] = [Role.Artist];

const mockService = {
  create: jest
    .fn()
    .mockImplementation((dto: CreateAlbumDto, id: string, roles: Role[]) => {
      return new ServiceResult(mockAlbum);
    }),
  findOne: jest.fn().mockImplementation((id: string) => {
    return new ServiceResult(mockAlbum);
  }),
  findAll: jest.fn().mockImplementation((roles: Role[], query: any) => {
    return new ServiceResult(mockAlbums);
  }),
};

describe('Album Controller', () => {
  let controller: AlbumController;
  let service: AlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [AlbumService],
    })
      .overrideProvider(AlbumService)
      .useValue(mockService)
      .compile();

    controller = module.get<AlbumController>(AlbumController);
    service = module.get<AlbumService>(AlbumService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAlbum', () => {
    it('should create an album', async () => {
      const dto = new CreateAlbumDto();
      const request = { user: { id: '123', roles } };
      const response = await controller.createAlbum(dto, request);

      expect(response).toEqual(mockAlbum);
      expect(service.create).toHaveBeenCalledWith(dto, request.user.id, roles);
    });
  });

  describe('findOne', () => {
    it('should find an album by ID', async () => {
      const id = '123456';
      const response = await controller.findOne(id);

      expect(response).toEqual(mockAlbum);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    it('should find all albums', async () => {
      const request = { user: { roles } } as any;
      const query = {};
      const response = await controller.findAll(request, query);

      expect(response).toEqual(mockAlbums);
      expect(service.findAll).toHaveBeenCalledWith(request.user.roles, query);
    });
  });
});
