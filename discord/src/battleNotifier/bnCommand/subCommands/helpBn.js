const helpMessage = `This is Battle Notifier 🔔 I'll send you a message whenever your favourite battles are started.

Commands:
\`\`\`
!bn       - set your notifications
!bn rules - view rules detailed explanation
!bn get   - view your current notifications
!bn on    - turn notifications on 
!bn off   - turn notifications off
!bn alias - view all battle type and attribute name aliases
!bn test  - simulate a battle to test your notifications
\`\`\`
`;

const helpBn = async user => {
  await user.send(helpMessage);
};

export default helpBn;
