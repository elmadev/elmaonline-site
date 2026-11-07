import styled from '@emotion/styled';
import type { OnlineStatus } from 'types/message';

const titles = {
  online: 'Online',
  away: 'Active in the last hour',
};

export const OnlineDot = ({
  status,
  className,
}: {
  status?: OnlineStatus;
  className?: string;
}) =>
  status ? (
    <Dot status={status} title={titles[status]} className={className} />
  ) : null;

const Dot = styled.span<{ status: 'online' | 'away' }>`
  display: inline-block;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
  background: ${p => (p.status === 'online' ? '#2ed175' : '#9e9e9e')};
`;
