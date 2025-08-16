import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Island } from '@prisma/client';
import { getValues, sortArray } from '@/common/utils/array';
import { getIslands } from '@/common/utils/data';
import { SortOrder } from '@/sort/sort.dto';
import { MockIslandService } from './__mocks__/island.service';
import { IslandController } from './island.controller';
import { IslandService } from './island.service';

describe('IslandController', () => {
  const testIslandCode = '110140001';

  let islands: Island[];
  let controller: IslandController;

  beforeAll(async () => {
    islands = await getIslands();
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
    let filteredIslandsByName: Island[];

    beforeAll(() => {
      filteredIslandsByName = islands.filter((p) =>
        p.name.toLowerCase().includes(testIslandName.toLowerCase()),
      );
    });

    it('should return all islands', async () => {
      const { data } = await controller.find();

      for (const island of data) {
        expect(island).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            coordinate: expect.any(String),
            isOutermostSmall: expect.any(Boolean),
            isPopulated: expect.any(Boolean),
            latitude: expect.any(Number),
            longitude: expect.any(Number),
            name: expect.any(String),
            regencyCode:
              island.regencyCode === null ? null : expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(islands.length);
    });

    it('should return islands filtered by name', async () => {
      const { data } = await controller.find({ name: testIslandName });

      for (const island of data) {
        expect(island).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            coordinate: expect.any(String),
            isOutermostSmall: expect.any(Boolean),
            isPopulated: expect.any(Boolean),
            latitude: expect.any(Number),
            longitude: expect.any(Number),
            name: expect.stringMatching(new RegExp(testIslandName, 'i')),
            regencyCode:
              island.regencyCode === null ? null : expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(filteredIslandsByName.length);
    });

    it('should return empty array if there is no island with the corresponding name', async () => {
      const { data } = await controller.find({ name: 'unknown island' });

      expect(data).toEqual([]);
    });

    it('should return islands filtered and sorted by name ascending', async () => {
      const { data } = await controller.find({
        name: testIslandName,
        sortBy: 'name',
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(filteredIslandsByName, 'name'), 'code'),
      );
    });

    it('should return islands filtered and sorted by name descending', async () => {
      const { data } = await controller.find({
        name: testIslandName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(
          sortArray(filteredIslandsByName, 'name', SortOrder.DESC),
          'code',
        ),
      );
    });

    it('should return islands filtered by name and sorted by coordinate ascending', async () => {
      const { data } = await controller.find({
        name: testIslandName,
        sortBy: 'coordinate',
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(filteredIslandsByName, 'coordinate'), 'code'),
      );
    });

    it('should return islands filtered by name and sorted by coordinate descending', async () => {
      const { data } = await controller.find({
        name: testIslandName,
        sortBy: 'coordinate',
        sortOrder: SortOrder.DESC,
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(
          sortArray(filteredIslandsByName, 'coordinate', SortOrder.DESC),
          'code',
        ),
      );
    });

    it('should return islands filtered by regencyCode', async () => {
      const regencyCode = '1101';
      const { data } = await controller.find({ regencyCode });

      for (const island of data) {
        expect(island).toEqual(expect.objectContaining({ regencyCode }));
      }

      expect(data).toHaveLength(
        islands.filter((island) => island.regencyCode === regencyCode).length,
      );
    });

    it('should return islands that does not belong to any regency', async () => {
      const { data } = await controller.find({ regencyCode: '' });

      for (const island of data) {
        expect(island).toEqual(expect.objectContaining({ regencyCode: null }));
      }

      expect(data).toHaveLength(
        islands.filter((island) => island.regencyCode === null).length,
      );
    });
  });

  describe('findByCode', () => {
    it('should return island with the corresponding code', async () => {
      const testIsland = await controller.findByCode({ code: testIslandCode });
      const expectedIsland = islands.find(
        (island) => island.code === testIslandCode,
      );

      expect(testIsland).toEqual(expect.objectContaining(expectedIsland));
    });

    it('should throw NotFoundException if there is no matching island', async () => {
      await expect(
        controller.findByCode({ code: '000000000' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
