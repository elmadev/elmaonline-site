import { Chat, Kuski } from 'data/models';
import sequelize from 'sequelize';

export const schema = [
  `
    type DatabaseChatLine {
        ChatIndex: Int
        KuskiIndex: Int
        Entered: String
        Text: String
        KuskiData: DatabaseKuski
    }
  `,
];

export const queries = [
  `
    getChatLines(start: String, end: String): [DatabaseChatLine]
  `,
];

export const resolvers = {
  RootQuery: {
    async getChatLines(parent, { start, end }) {
      const chatLines = await Chat.findAll({
        limit: 2048,
        order: [['ChatIndex', 'ASC']],
        include: [{ model: Kuski, as: 'KuskiData', attributes: ['Kuski'] }],
        where: {
          Entered: {
            [sequelize.Op.between]: [start, end],
          },
        },
      });
      return chatLines;
    },
  },
};
