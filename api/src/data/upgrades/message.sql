-- Private messages: 1:1 and group conversations
-- A 1:1 conversation is a conversation with IsGroup = 0 and two members

CREATE TABLE message_conversation (
  ConversationIndex INT(11) NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NULL DEFAULT NULL,
  IsGroup TINYINT(1) NOT NULL DEFAULT 0,
  CreatedBy INT(11) NOT NULL,
  CreatedAt INT(11) NOT NULL,
  LastMessageAt INT(11) NOT NULL,
  PRIMARY KEY (ConversationIndex)
);

CREATE TABLE message_member (
  MemberIndex INT(11) NOT NULL AUTO_INCREMENT,
  ConversationIndex INT(11) NOT NULL,
  KuskiIndex INT(11) NOT NULL,
  JoinedAt INT(11) NOT NULL,
  LastReadMessageIndex INT(11) NOT NULL DEFAULT 0,
  LeftAt INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (MemberIndex),
  UNIQUE KEY ConversationKuski (ConversationIndex, KuskiIndex),
  KEY KuskiIndex (KuskiIndex)
);

CREATE TABLE message (
  MessageIndex INT(11) NOT NULL AUTO_INCREMENT,
  ConversationIndex INT(11) NOT NULL,
  KuskiIndex INT(11) NOT NULL,
  Text TEXT NOT NULL,
  CreatedAt INT(11) NOT NULL,
  Type ENUM('text', 'system') NOT NULL DEFAULT 'text',
  -- chosen by the sender per message, NULL never expires. expired messages
  -- are hidden right away and deleted by a cron job
  ExpiresAt INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (MessageIndex),
  KEY ConversationMessage (ConversationIndex, MessageIndex),
  KEY ExpiresAt (ExpiresAt)
);

-- Online status, NULL when hidden or never active on the site
ALTER TABLE kuski
ADD COLUMN LastActive INT(11) NULL DEFAULT NULL;
