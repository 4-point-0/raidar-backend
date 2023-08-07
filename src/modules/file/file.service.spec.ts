import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from '../file/file.entity';
import { Song } from '../song/song.entity';
import { AwsStorageService } from './aws-storage.service';
import { FileService } from '../file/file.service';
import { Repository } from 'typeorm';
import { ServerError } from '../../helpers/response/errors';

jest.mock('./aws-storage.service');

describe('FileService', () => {
  let service: FileService;
  let fileRepository: Repository<File>;
  let songRepository: Repository<Song>;
  let awsStorageService: AwsStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: getRepositoryToken(File),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockReturnValue({ save: jest.fn() }),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Song),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue({ save: jest.fn() }),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn(),
          },
        },
        AwsStorageService,
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    fileRepository = module.get<Repository<File>>(getRepositoryToken(File));
    songRepository = module.get<Repository<Song>>(getRepositoryToken(Song));
    awsStorageService = module.get<AwsStorageService>(AwsStorageService);
  });

  it('should upload a file', async () => {
    // Arrange
    const buffer = Buffer.from('test data');
    const fileName = 'testfile.wav';
    const mimeType = 'audio/wav';

    jest.spyOn(awsStorageService, 'uploadFile').mockResolvedValue(
      Promise.resolve({
        ETag: 'test-etag',
        Bucket: 'test-bucket',
        Location: 'test-url',
        Key: 'test-key',
      }) as any,
    );

    // Act
    const result = await service.uploadFile(buffer, fileName, mimeType);

    // Assert
    expect(result).not.toBeInstanceOf(ServerError);
    expect(awsStorageService.uploadFile).toHaveBeenCalled();
  });

  it('should update a file', async () => {
    // Arrange
    const fileId = '1';
    const buffer = Buffer.from('test data');
    const fileName = 'testfile.wav';
    const mimeType = 'audio/wav';

    const mockFile = new File();
    mockFile.id = fileId;
    jest.spyOn(fileRepository, 'findOne').mockResolvedValue(mockFile);

    jest.spyOn(awsStorageService, 'putFile').mockResolvedValue(
      Promise.resolve({
        ETag: 'test-etag',
        Bucket: 'test-bucket',
        Location: 'test-url',
        Key: 'test-key',
      }) as any,
    );
    const result = await service.putFile(fileId, buffer, fileName, mimeType);

    expect(result).not.toBeInstanceOf(ServerError);
    expect(awsStorageService.putFile).toHaveBeenCalled();
  });

  it('should remove a file', async () => {
    const fileId = '1';
    const mockFile = new File();
    mockFile.id = fileId;
    mockFile.key = 'test-key';

    jest.spyOn(fileRepository, 'findOne').mockResolvedValue(mockFile);
    jest
      .spyOn(awsStorageService, 'removeFile')
      .mockResolvedValue(Promise.resolve(true));

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    jest
      .spyOn(songRepository, 'createQueryBuilder')
      .mockReturnValue(mockQueryBuilder as any);

    const result = await service.remove(fileId);

    expect(result).not.toBeInstanceOf(ServerError);
    expect(awsStorageService.removeFile).toHaveBeenCalledWith(mockFile.key);
    expect(fileRepository.remove).toHaveBeenCalled();
  });
});
