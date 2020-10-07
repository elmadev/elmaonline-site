const testBn = require('../testBn');
const { messages, emojis } = require('../../config');
const {
  mockMessage,
  mockStore,
  mockChannel,
  mockUser,
  userConfigsExample1,
  expectAsyncResult,
  expectAsyncResultProperty,
} = require('../../../testUtils');

const {
  testBnMessage,
  incorrectTestMessage,
  testResultMessage,
} = testBn.messages;

let store;

beforeEach(() => {
  store = mockStore(userConfigsExample1);
});

describe('user without config', () => {
  test('responds with user config not found', async () => {
    const author = mockUser('100');
    const userReply = mockMessage({ content: 'lack of separator' });
    const channel = mockChannel({ userReply });
    const message = mockMessage({ author, channel });

    await testBn({ message, store });

    expect(store.get).toHaveBeenCalledTimes(1);
    expect(store.get).toHaveBeenCalledWith('100');
    await expectAsyncResult(store.get, undefined);

    expect(author.send).toHaveBeenCalledTimes(1);
    expect(author.send).toHaveBeenCalledWith(messages.configNotFound);
  });
});

describe('user with config and bad input', () => {
  const expectIncorrectInputResponse = async userReplyContent => {
    const author = mockUser('1');
    const userReply = mockMessage({ content: userReplyContent });
    const channel = mockChannel({ userReply });
    const message = mockMessage({ author, channel });

    await testBn({ message, store });

    /** Expect store get to find user config */
    expect(store.get).toHaveBeenCalledTimes(1);
    expect(store.get).toHaveBeenCalledWith('1');
    await expectAsyncResult(store.get, userConfigsExample1['1']);

    /** Expect bot to redirect to channel with message */
    expect(message.send).toHaveBeenCalledTimes(1);
    expect(message.send).toHaveBeenCalledWith(testBnMessage);
    await expectAsyncResultProperty(message.send, 'channel', channel);

    /** Expect user to reply with test */
    expect(channel.readUserMessage).toHaveBeenCalledTimes(1);
    expect(channel.readUserMessage).toHaveBeenCalledWith(author);
    await expectAsyncResult(channel.readUserMessage, userReply);

    /** Expect respond with incorrect test message */
    expect(channel.send).toHaveBeenCalledTimes(1);
    expect(channel.send).toHaveBeenCalledWith(incorrectTestMessage);
    expect(userReply.react).toHaveBeenCalledTimes(1);
    expect(userReply.react).toHaveBeenCalledWith(emojis.error);
  };

  test('input without separator responds with incorrect test', async () => {
    await expectIncorrectInputResponse('lack of separator');
  });

  test('with only left side responds with incorrect test', async () => {
    await expectIncorrectInputResponse('Normal by');
  });

  test('with only right side responds with incorrect test', async () => {
    await expectIncorrectInputResponse('by Markku');
  });

  test('with any by any responds with incorrect test', async () => {
    await expectIncorrectInputResponse('Any by any');
  });
});

describe('user with config and good input', () => {
  const runTestAssertions = async ({
    userId,
    userReplyContent,
    testMessage,
    matches = true,
  }) => {
    const author = mockUser(userId);
    const userReply = mockMessage({ content: userReplyContent });
    const channel = mockChannel({ userReply });
    const message = mockMessage({ author, channel });

    await testBn({ message, store });

    /** Expect store get to find user config */
    expect(store.get).toHaveBeenCalledTimes(1);
    expect(store.get).toHaveBeenCalledWith(userId);
    await expectAsyncResult(store.get, userConfigsExample1[userId]);

    /** Expect bot to redirect to channel with message */
    expect(message.send).toHaveBeenCalledTimes(1);
    expect(message.send).toHaveBeenCalledWith(testBnMessage);
    await expectAsyncResultProperty(message.send, 'channel', channel);

    /** Expect user to reply with test */
    expect(channel.readUserMessage).toHaveBeenCalledTimes(1);
    expect(channel.readUserMessage).toHaveBeenCalledWith(author);
    await expectAsyncResult(channel.readUserMessage, userReply);

    expect(channel.send).toHaveBeenCalledTimes(2);
    expect(channel.send).toHaveBeenNthCalledWith(1, `Test: ${testMessage}`);
    expect(channel.send).toHaveBeenNthCalledWith(2, testResultMessage(matches));
    expect(userReply.react).toHaveBeenCalledTimes(1);
    expect(userReply.react).toHaveBeenCalledWith(emojis.ok);
  };

  test('battle type and designer matches user config', async () => {
    runTestAssertions({
      userId: '1',
      userReplyContent: 'First Finish by Sla',
      testMessage: 'First Finish battle started by Sla',
    });
  });

  test('level name and designer matches user config', async () => {
    runTestAssertions({
      userId: '6',
      userReplyContent: 'JoPi50.lev by John',
      testMessage: 'JoPi50 battle started by John',
    });
  });

  test('level name, battleType and designer matches user config', async () => {
    runTestAssertions({
      userId: '6',
      userReplyContent: 'Normal JoPi50.lev by John',
      testMessage: 'JoPi50 Normal battle started by John',
    });
  });
});
