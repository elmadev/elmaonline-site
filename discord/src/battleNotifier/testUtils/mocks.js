const mockStore = userConfigs => {
  return {
    get: jest.fn(id => Promise.resolve(userConfigs[id])),
    set: jest.fn(() => Promise.resolve()),
    getAll: jest.fn(() => Promise.resolve(userConfigs)),
  };
};

const mockMessage = ({ author, channel, content }) => {
  return {
    content,
    author,
    send: jest.fn(() => Promise.resolve({ channel })),
    react: jest.fn(() => Promise.resolve()),
  };
};

const mockSendMessage = () =>
  jest.fn(message => Promise.resolve(mockMessage({ content: message })));

const mockUser = (id, username = 'RandomUser') => {
  return { id, username, send: mockSendMessage() };
};

const mockChannel = ({ userReply }) => {
  return {
    readUserMessage: jest.fn(() => Promise.resolve(userReply)),
    send: mockSendMessage(),
  };
};

const mockBattle = ({
  battleType = '',
  designer = '',
  level = '',
  durationMinutes = 0,
  ...attrs
}) => {
  return { battleType, designer, level, durationMinutes, ...attrs };
};

module.exports = { mockStore, mockUser, mockMessage, mockChannel, mockBattle };
