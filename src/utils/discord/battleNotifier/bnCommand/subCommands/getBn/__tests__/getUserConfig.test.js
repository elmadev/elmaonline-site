const getUserConfig = require('../getUserConfig');
const { messages } = require('../../../config');

const {
  mockStore,
  mockUser,
  userConfigsExample1,
} = require('../../../../testUtils');

const { yourConfigMessage } = getUserConfig.messages;

let store;

beforeEach(() => {
  store = mockStore(userConfigsExample1);
});

describe('with user not in the store', () => {
  test('get user config returns undefined', async () => {
    const user = mockUser('0');
    await getUserConfig({ user, store });

    expect(store.get).toHaveBeenCalledTimes(1);
    expect(store.get).toHaveBeenCalledWith('0');

    const expected = messages.configNotFound;
    expect(user.send).toHaveBeenCalledTimes(1);
    expect(user.send).toHaveBeenCalledWith(expected);
  });
});

describe('with user in store', () => {
  test('get user config correctly', async () => {
    const user = mockUser('1');
    await getUserConfig({ user, store });

    expect(store.get).toHaveBeenCalledTimes(1);
    expect(store.get).toHaveBeenCalledWith('1');

    const expectedConfig = 'Normal, First Finish, Flag Tag by Bene, Sla, Spef';
    const expected = `${yourConfigMessage} **ON**\n(*to turn them off use \`!bn off\`*)\n\`\`\`${expectedConfig}\`\`\``;
    expect(user.send).toHaveBeenCalledTimes(1);
    expect(user.send).toHaveBeenCalledWith(expected);
  });
});
