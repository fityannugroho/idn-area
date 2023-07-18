import { getValues, sortArray } from '@/common/utils/array';
import { Test, TestingModule } from '@nestjs/testing';
import IdnArea, { IslandTransformed } from 'idn-area-data';
import { MockIslandService } from './__mocks__/island.service';
import { IslandController } from './island.controller';
import { IslandService } from './island.service';
import { NotFoundException } from '@nestjs/common';

describe('IslandController', () => {
  const testIslandCode = '110140001';

  let islands: IslandTransformed[];
  let controller: IslandController;

  beforeAll(async () => {
    islands = await IdnArea.islands({ transform: true });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IslandController],
      providers: [
        { provide: IslandService, useValue: new MockIslandService(islands) },
      ],
    }).compile();

    controller = module.get<IslandController>(IslandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    const testIslandName = 'bali';
    let filteredIslandsByName: IslandTransformed[];

    beforeAll(() => {
      filteredIslandsByName = islands.filter((p) =>
        p.name.toLowerCase().includes(testIslandName.toLowerCase()),
      );
    });

    it('should return all islands', async () => {
      const testIslands = await controller.find();

      expect(testIslands).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            coordinate: expect.any(String),
            isOutermostSmall: expect.any(Boolean),
            isPopulated: expect.any(Boolean),
            latitude: expect.any(Number),
            longitude: expect.any(Number),
            name: expect.any(String),
            regencyCode: expect.any(String),
          }),
        ]),
      );
      expect(testIslands).toHaveLength(islands.length);
    });

    it('should return islands filtered by name', async () => {
      const testIslands = await controller.find({ name: testIslandName });

      expect(testIslands).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            coordinate: expect.any(String),
            isOutermostSmall: expect.any(Boolean),
            isPopulated: expect.any(Boolean),
            latitude: expect.any(Number),
            longitude: expect.any(Number),
            name: expect.stringMatching(new RegExp(testIslandName, 'i')),
            regencyCode: expect.any(String),
          }),
        ]),
      );
      expect(testIslands).toHaveLength(filteredIslandsByName.length);
    });

    it('should return empty array if there is no island with the corresponding name', async () => {
      const testIslands = await controller.find({ name: 'unknown island' });

      expect(testIslands).toEqual([]);
    });

    it('should return islands filtered and sorted by name ascending', async () => {
      const testIslands = await controller.find({
        name: testIslandName,
        sortBy: 'name',
      });

      expect(getValues(testIslands, 'code')).toEqual(
        getValues(sortArray(filteredIslandsByName, 'name'), 'code'),
      );
    });

    it('should return islands filtered and sorted by name descending', async () => {
      const testIslands = await controller.find({
        name: testIslandName,
        sortBy: 'name',
        sortOrder: 'desc',
      });

      expect(getValues(testIslands, 'code')).toEqual(
        getValues(sortArray(filteredIslandsByName, 'name', 'desc'), 'code'),
      );
    });

    it('should return islands filtered by name and sorted by coordinate ascending', async () => {
      const testIslands = await controller.find({
        name: testIslandName,
        sortBy: 'coordinate',
      });

      expect(getValues(testIslands, 'code')).toEqual(
        getValues(sortArray(filteredIslandsByName, 'coordinate'), 'code'),
      );
    });

    it('should return islands filtered by name and sorted by coordinate descending', async () => {
      const testIslands = await controller.find({
        name: testIslandName,
        sortBy: 'coordinate',
        sortOrder: 'desc',
      });

      expect(getValues(testIslands, 'code')).toEqual(
        getValues(
          sortArray(filteredIslandsByName, 'coordinate', 'desc'),
          'code',
        ),
      );
    });
  });

  describe('findByCode', () => {
    it('should return island with the corresponding code', async () => {
      const testIsland = await controller.findByCode({ code: testIslandCode });

      expect(testIsland).toEqual(
        expect.objectContaining({
          code: testIslandCode,
          coordinate: expect.any(String),
          isOutermostSmall: expect.any(Boolean),
          isPopulated: expect.any(Boolean),
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          name: expect.any(String),
          regencyCode: testIslandCode.slice(0, 4),
        }),
      );
    });

    it('should throw NotFoundException if there is no matching island', async () => {
      await expect(
        controller.findByCode({ code: '000000000' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
