const helpMessage = `This is Battle Notifier 🔔 I'll send you a message to let you know when your favourite battles are started.

Commands:
\`\`\`
!bn       - to save new notifications
!bn get   - to see your current notifications
!bn on    - to turn notifications on 
!bn off   - to turn notifications off
!bn alias - show all battle type name aliases
!bn test  - simulate a battle to test your notifications
\`\`\`
`;

const helpBn = async user => {
  await user.send(helpMessage);
};

module.exports = helpBn;
