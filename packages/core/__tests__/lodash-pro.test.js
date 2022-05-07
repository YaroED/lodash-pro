const lodashPro = require('../index');

describe('lodash-pro', () => {
    test('isPhone', () => {
        expect(lodashPro.isPhone(13312341234)).toBe(true)
    });
});
