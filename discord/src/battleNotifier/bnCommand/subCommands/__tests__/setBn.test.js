const setBn = require('../setBn');
const { emojis } = require('../../config');
const { UserConfigLists } = require('../../../userConfig');
const {
  mockStore,
  mockUser,
  mockMessage,
  mockChannel,
  userConfigsExample1,
  expectAsyncResult,
  expectAsyncResultProperty,
} = require('../../../testUtils');

const {
  editMessage,
  yourConfigMessage,
  firstConfigMessage,
  setConfigErrorMessage,
  writeBnHelpMessage,
} = setBn.messages;

let store;

beforeEach(() => {
  store = mockStore(userConfigsExample1);
});

describe('user replies with bad format message and config does not change', () => {
  test('new user replies without the `by` separator and nothing happens', async () => {
    const author = mockUser('100', 'NewUser');
    const userReply = mockMessage({ content: 'lack of separator' });
    const channel = mockChannel({ userReply });
    const message = mockMessage({ author, channel });

    await setBn({ message, store });

    /** Expect store get to not find user config */
    expect(store.get).toHaveBeenCalledTimes(1);
    expect(store.get).toHaveBeenCalledWith('100');
    await expectAsyncResult(store.get, undefined);

    /** Expect bot to redirect to channel with message */
    expect(message.send).toHaveBeenCalledTimes(1);
    expect(message.send).toHaveBeenCalledWith(firstConfigMessage);
    await expectAsyncResultProperty(message.send, 'channel', channel);

    /** Expect user to reply with config */
    expect(channel.readUserMessage).toHaveBeenCalledTimes(1);
    expect(channel.readUserMessage).toHaveBeenCalledWith(author);
    await expectAsyncResult(channel.readUserMessage, userReply);

    /** Expect bot to tell the user that could not use the reply */
    expect(channel.send).toHaveBeenCalledTimes(1);
    expect(channel.send).toHaveBeenCalledWith(setConfigErrorMessage);
    expect(userReply.react).toHaveBeenCalledTimes(1);
    expect(userReply.react).toHaveBeenCalledWith(emojis.error);

    /** Expect nothing to happen with the store */
    expect(store.set).not.toHaveBeenCalled();
  });
});

describe('user sets notifications for first time', () => {
  test('new user sets notifications successfully', async () => {
    const author = mockUser('100', 'NewUser');
    const userReply = mockMessage({ content: 'ff by Markku' });
    const channel = mockChannel({ userReply });
    const message = mockMessage({ author, channel });

    await setBn({ message, store });

    /** Expect store get to not find user config */
    expect(store.get).toHaveBeenCalledTimes(1);
    expect(store.get).toHaveBeenCalledWith('100');
    await expectAsyncResult(store.get, undefined);

    /** Expect bot to redirect to channel with message */
    expect(message.send).toHaveBeenCalledTimes(1);
    expect(message.send).toHaveBeenCalledWith(firstConfigMessage);
    await expectAsyncResultProperty(message.send, 'channel', channel);

    /** Expect user to reply with config */
    expect(channel.readUserMessage).toHaveBeenCalledTimes(1);
    expect(channel.readUserMessage).toHaveBeenCalledWith(author);
    await expectAsyncResult(channel.readUserMessage, userReply);

    /** Expect store.set to be called with new user config */
    expect(store.set).toHaveBeenCalledTimes(1);
    expect(store.set).toHaveBeenCalledWith('100', {
      ...UserConfigLists({
        notifyList: [{ battleTypes: ['First Finish'], designers: ['Markku'] }],
      }),
      username: 'NewUser',
    });

    /** Expect bot to reply with newly created user config */
    expect(channel.send).toBeCalledTimes(1);
    expect(channel.send).toBeCalledWith(
      `${yourConfigMessage}\n\n\`\`\`First Finish by Markku\`\`\`\n${writeBnHelpMessage}`,
    );

    /** Expect bot to react with OK emoji to user message */
    expect(userReply.react).toHaveBeenCalledTimes(1);
    expect(userReply.react).toHaveBeenCalledWith(emojis.ok);
  });
});

describe('user edits his current notifications', () => {
  test('bot replies with current config and user sets new successfuly', async () => {
    const author = mockUser('1', 'Kopaka');
    const userReply = mockMessage({ content: 'ff by Markku' });
    const channel = mockChannel({ userReply });
    const message = mockMessage({ author, channel });

    const currentConfig = 'Normal, First Finish, Flag Tag by Bene, Sla, Spef';
    const expectedMessage = editMessage(currentConfig);

    await setBn({ message, store });

    /** Expect store get to find user config */
    expect(store.get).toHaveBeenCalledTimes(1);
    expect(store.get).toHaveBeenCalledWith('1');
    await expectAsyncResult(store.get, userConfigsExample1['1']);

    /** Expect bot to redirect to channel with message */
    expect(message.send).toHaveBeenCalledTimes(1);
    expect(message.send).toHaveBeenCalledWith(expectedMessage);
    await expectAsyncResultProperty(message.send, 'channel', channel);

    /** Expect user to reply with config */
    expect(channel.readUserMessage).toHaveBeenCalledTimes(1);
    expect(channel.readUserMessage).toHaveBeenCalledWith(author);
    await expectAsyncResult(channel.readUserMessage, userReply);

    /** Expect store.set to be called with new user config */
    expect(store.set).toHaveBeenCalledTimes(1);
    expect(store.set).toHaveBeenCalledWith('1', {
      ...UserConfigLists({
        notifyList: [{ battleTypes: ['First Finish'], designers: ['Markku'] }],
      }),
      username: 'Kopaka',
    });

    /** Expect bot to reply with newly created user config */
    expect(channel.send).toBeCalledTimes(1);
    expect(channel.send).toBeCalledWith(
      `${yourConfigMessage}\n\n\`\`\`First Finish by Markku\`\`\`\n${writeBnHelpMessage}`,
    );

    /** Expect bot to react with OK emoji to user message */
    expect(userReply.react).toHaveBeenCalledTimes(1);
    expect(userReply.react).toHaveBeenCalledWith(emojis.ok);
  });
});
