import { Test, TestingModule } from '@nestjs/testing';
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
  create: jest.fn().mockImplementation(() => {
    return new ServiceResult(mockAlbum);
  }),
  findOne: jest.fn().mockImplementation(() => {
    return new ServiceResult(mockAlbum);
  }),
  findAll: jest.fn().mockImplementation(() => {
    return new ServiceResult(mockAlbums);
  }),
};

describe('Album Service', () => {
  let service: AlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumService],
    })
      .overrideProvider(AlbumService)
      .useValue(mockService)
      .compile();

    service = module.get<AlbumService>(AlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an album', async () => {
      const dto = new CreateAlbumDto();
      const request = { user: { id: '123', roles } };
      const response = await service.create(dto, request.user.id, roles);

      expect(response).toEqual(new ServiceResult(mockAlbum));
    });
  });

  describe('findOne', () => {
    it('should find an album by ID', async () => {
      const id = '123456';
      const response = await service.findOne(id);

      expect(response).toEqual(new ServiceResult(mockAlbum));
    });
  });

  describe('findAll', () => {
    it('should find all albums', async () => {
      const request = { user: { roles } } as any;
      const query = {};
      const response = await service.findAll(request.user.roles, query);

      expect(response).toEqual(new ServiceResult(mockAlbums));
    });
  });
});
