import { ApiDataResponse } from '../api-data-response.decorator';

// Mock classes to use in tests
class TestModel {
  id: number;
  name: string;
}

class AnotherModel {
  title: string;
  content: string;
}

describe('ApiDataResponse Decorator', () => {
  describe('single model response', () => {
    it('should create decorator for single model with minimal options', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create decorator for single model with description', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        description: 'Returns a single test model',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create decorator for single model with custom message', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        message: 'Successfully retrieved test model',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create decorator for single model with array message', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        message: ['Success', 'Model retrieved'],
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create decorator for single model with all options', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        description: 'Complete test model response',
        message: 'All options provided',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });
  });

  describe('multiple model response', () => {
    it('should create decorator for multiple models with minimal options', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        multiple: true,
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create decorator for multiple models with description', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        multiple: true,
        description: 'Returns an array of test models',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create decorator for multiple models with custom message', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        multiple: true,
        message: 'Successfully retrieved test models',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should create decorator for multiple models with all options', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        multiple: true,
        description: 'Complete test models response',
        message: 'All options provided for array',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });
  });

  describe('different model types', () => {
    it('should work with different model classes', () => {
      const decoratorForTestModel = ApiDataResponse({
        model: TestModel,
        description: 'Test model response',
      });

      const decoratorForAnotherModel = ApiDataResponse({
        model: AnotherModel,
        multiple: true,
        description: 'Another model array response',
      });

      expect(decoratorForTestModel).toBeDefined();
      expect(decoratorForAnotherModel).toBeDefined();
      expect(typeof decoratorForTestModel).toBe('function');
      expect(typeof decoratorForAnotherModel).toBe('function');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined optional properties', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        multiple: undefined, // Should default to single
        description: undefined, // Should handle undefined description
        message: undefined, // Should handle undefined message
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should handle false multiple value', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        multiple: false,
        description: 'Explicitly single model',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should handle empty string message', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        message: '',
        description: 'Empty message test',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should handle empty array message', () => {
      const decorator = ApiDataResponse({
        model: TestModel,
        message: [],
        description: 'Empty array message test',
      });

      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });
  });

  describe('conditional logic coverage', () => {
    it('should cover all branches of multiple property logic', () => {
      // Test when multiple is true
      const multipleTrue = ApiDataResponse({
        model: TestModel,
        multiple: true,
      });

      // Test when multiple is false
      const multipleFalse = ApiDataResponse({
        model: TestModel,
        multiple: false,
      });

      // Test when multiple is undefined (default case)
      const multipleUndefined = ApiDataResponse({
        model: TestModel,
      });

      expect(multipleTrue).toBeDefined();
      expect(multipleFalse).toBeDefined();
      expect(multipleUndefined).toBeDefined();
    });

    it('should cover description conditional logic', () => {
      // Test with description provided
      const withDescription = ApiDataResponse({
        model: TestModel,
        description: 'Has description',
      });

      // Test without description
      const withoutDescription = ApiDataResponse({
        model: TestModel,
      });

      expect(withDescription).toBeDefined();
      expect(withoutDescription).toBeDefined();
    });
  });
});
