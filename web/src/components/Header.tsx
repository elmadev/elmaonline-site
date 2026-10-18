import styled from '@emotion/styled';

type HeaderProps = {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  children?: React.ReactNode;
  nomargin?: boolean;
  right?: boolean;
  top?: boolean;
  onClick?: (() => void) | null;
  mLeft?: boolean;
};

const Header = ({
  h1 = true,
  h2 = false,
  h3 = false,
  children = null,
  nomargin = false,
  right = false,
  top = false,
  onClick = null,
  mLeft = false,
}: HeaderProps) => {
  const containerProps = {
    link: Boolean(onClick),
    onClick: () => onClick && onClick(),
    right,
    top,
    nomargin,
    mLeft,
  };
  return (
    <>
      {h1 && !h2 && !h3 && (
        <Container1 {...containerProps}>{children}</Container1>
      )}
      {h2 && <Container2 {...containerProps}>{children}</Container2>}
      {h3 && <Container3 {...containerProps}>{children}</Container3>}
    </>
  );
};

type ContainerProps = {
  link: boolean;
  right: boolean;
  top: boolean;
  nomargin: boolean;
  mLeft: boolean;
};

const Container1 = styled.h1<ContainerProps>`
  margin: ${p => (p.nomargin ? '0' : p.theme.padSmall)};
  margin-left: ${p => (p.mLeft ? p.theme.padSmall : 0)};
  margin-bottom: ${p => p.theme.padMedium};
  margin-top: ${p => (p.top ? p.theme.padMedium : '0')};
  color: ${p => (p.link ? p.theme.linkColor : p.theme.headerColor)};
  cursor: ${p => (p.link ? 'pointer' : 'auto')};
  font-weight: 600;
  font-size: 36px;
  text-transform: none;
  letter-spacing: 0.5px;
  text-align: ${p => (p.right ? 'right' : 'left')};
`;

const Container2 = styled.h2<ContainerProps>`
  margin: ${p => (p.nomargin ? '0' : p.theme.padSmall)};
  margin-left: ${p => (p.mLeft ? p.theme.padSmall : 0)};
  margin-bottom: ${p => p.theme.padSmall};
  margin-top: ${p => (p.top ? p.theme.padMedium : '0')};
  color: ${p => (p.link ? p.theme.linkColor : p.theme.headerColor)};
  cursor: ${p => (p.link ? 'pointer' : 'auto')};
  font-weight: 600;
  font-size: 22px;
  text-transform: none;
  letter-spacing: 0.5px;
  text-align: ${p => (p.right ? 'right' : 'left')};
`;

const Container3 = styled.h3<ContainerProps>`
  margin: ${p => (p.nomargin ? '0' : p.theme.padSmall)};
  margin-left: ${p => (p.mLeft ? p.theme.padSmall : 0)};
  margin-bottom: 0px;
  margin-top: ${p => (p.top ? p.theme.padMedium : '0')};
  color: ${p => (p.link ? p.theme.linkColor : p.theme.headerColor)};
  cursor: ${p => (p.link ? 'pointer' : 'auto')};
  font-weight: 600;
  font-size: 1em;
  text-transform: none;
  letter-spacing: 0.5px;
  text-align: ${p => (p.right ? 'right' : 'left')};
`;

export default Header;
