import { getValues, sortArray } from '@common/utils/array';
import { getRegencies } from '@common/utils/data';
import { SortOrder } from '@/sort/sort.dto';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Regency } from '@prisma/client';
import { MockRegencyService } from './__mocks__/regency.service';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

describe('RegencyController', () => {
  const testRegencyCode = '1101';

  let regencies: Regency[];
  let controller: RegencyController;

  beforeAll(async () => {
    regencies = await getRegencies();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegencyController],
      providers: [
        {
          provide: RegencyService,
          useValue: new MockRegencyService(regencies),
        },
      ],
    }).compile();

    controller = module.get<RegencyController>(RegencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    const testRegencyName = 'jakarta';
    let filteredRegenciesByName: Regency[];

    beforeAll(() => {
      filteredRegenciesByName = regencies.filter((p) =>
        p.name.toLowerCase().includes(testRegencyName.toLowerCase()),
      );
    });

    it('should return all regencies', async () => {
      const { data } = await controller.find();

      for (const regency of data) {
        expect(regency).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            provinceCode: expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(regencies.length);
    });

    it('should return regencies filtered by name', async () => {
      const { data } = await controller.find({ name: testRegencyName });

      for (const regency of data) {
        expect(regency).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testRegencyName, 'i')),
            provinceCode: expect.any(String),
          }),
        );
      }

      expect(data.length).toEqual(filteredRegenciesByName.length);
    });

    it('should return empty array if there is no regency with the corresponding name', async () => {
      const { data } = await controller.find({ name: 'unknown regency' });

      expect(data).toEqual([]);
    });

    it('should return regencies filtered and sorted by name ascending', async () => {
      const { data } = await controller.find({
        name: testRegencyName,
        sortBy: 'name',
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(filteredRegenciesByName, 'name'), 'code'),
      );
    });

    it('should return regencies filtered and sorted by name descending', async () => {
      const { data } = await controller.find({
        name: testRegencyName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(
          sortArray(filteredRegenciesByName, 'name', SortOrder.DESC),
          'code',
        ),
      );
    });

    it('should return regencies filtered by province code', async () => {
      const provinceCode = '11';
      const filteredRegenciesByProvince = regencies.filter(
        (p) => p.provinceCode === provinceCode,
      );
      const { data } = await controller.find({ provinceCode });

      for (const regency of data) {
        expect(regency).toEqual(expect.objectContaining({ provinceCode }));
      }

      expect(data.length).toEqual(filteredRegenciesByProvince.length);
    });
  });

  describe('findByCode', () => {
    it('should return a regency with matching code', async () => {
      const testRegency = await controller.findByCode({
        code: testRegencyCode,
      });
      const expectedRegency = regencies.find(
        (regency) => regency.code === testRegencyCode,
      );

      expect(testRegency).toEqual(expect.objectContaining(expectedRegency));
    });

    it('should throw NotFoundException if there is no matching regency', async () => {
      await expect(
        controller.findByCode({ code: '0000' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
